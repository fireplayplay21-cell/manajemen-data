/**
 * Google Drive Integration & File Storage Service
 * Target Folder: https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing
 */

export const TARGET_DRIVE_FOLDER_ID = '1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm';
export const TARGET_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1VFC4WO80VPCUkTHyYMlzSvOdkVRyiXLm?usp=sharing';

export interface DriveAuthToken {
  access_token: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
}

export interface UploadedDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  webContentLink?: string;
  size?: string;
  uploadedAt: string;
  category?: string;
}

let cachedToken: string | null = null;
let tokenClient: any = null;

// Initialize or request Token Client via Google Identity Services
export function initGoogleDriveTokenClient(clientId?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // If we already have a cached token in session, return it
    const sessionToken = sessionStorage.getItem('gdrive_access_token');
    const expiry = sessionStorage.getItem('gdrive_token_expiry');
    if (sessionToken && expiry && Date.now() < parseInt(expiry, 10)) {
      cachedToken = sessionToken;
      return resolve(sessionToken);
    }

    if (typeof window === 'undefined') {
      return reject(new Error('Window is not defined'));
    }

    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      return reject(new Error('Google Identity Services SDK (gsi/client) belum siap. Harap muat ulang halaman.'));
    }

    try {
      // Create token client if not exists
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId || '652643096610-dve.apps.googleusercontent.com', // Will work with current project OAuth flow
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }
          if (tokenResponse.access_token) {
            cachedToken = tokenResponse.access_token;
            sessionStorage.setItem('gdrive_access_token', tokenResponse.access_token);
            const expiresInMs = (tokenResponse.expires_in ? parseInt(tokenResponse.expires_in, 10) : 3500) * 1000;
            sessionStorage.setItem('gdrive_token_expiry', (Date.now() + expiresInMs).toString());
            resolve(tokenResponse.access_token);
          } else {
            reject(new Error('Gagal memperoleh token akses dari Google.'));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: '' });
    } catch (err: any) {
      reject(err);
    }
  });
}

/**
 * Upload a File object to Google Drive in the designated target folder
 */
export async function uploadFileToTargetDriveFolder(
  file: File,
  options?: {
    customFileName?: string;
    category?: string;
    folderId?: string;
    onProgress?: (progressPercent: number) => void;
  }
): Promise<UploadedDriveFile> {
  const folderId = options?.folderId || TARGET_DRIVE_FOLDER_ID;
  const fileName = options?.customFileName || file.name;

  let accessToken = cachedToken || sessionStorage.getItem('gdrive_access_token');
  if (!accessToken) {
    accessToken = await initGoogleDriveTokenClient();
  }

  const metadata = {
    name: fileName,
    parents: [folderId],
    description: `Diunggah melalui Sistem Manajemen Data SDN Lanto Dg. Pasewang (${options?.category || 'Umum'})`,
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  try {
    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,size',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        // Token expired, clear and re-request
        sessionStorage.removeItem('gdrive_access_token');
        cachedToken = null;
        const freshToken = await initGoogleDriveTokenClient();
        const retryRes = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,size',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${freshToken}`,
            },
            body: form,
          }
        );
        if (!retryRes.ok) {
          const errData = await retryRes.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `Gagal mengunggah file (${retryRes.status})`);
        }
        const data = await retryRes.json();
        return {
          id: data.id,
          name: data.name,
          mimeType: data.mimeType,
          webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
          webContentLink: data.webContentLink,
          size: data.size,
          uploadedAt: new Date().toISOString(),
          category: options?.category,
        };
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gagal mengunggah file (${res.status})`);
    }

    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      mimeType: data.mimeType,
      webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
      webContentLink: data.webContentLink,
      size: data.size,
      uploadedAt: new Date().toISOString(),
      category: options?.category,
    };
  } catch (error: any) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}
