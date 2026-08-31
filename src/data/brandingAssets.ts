// Assets default logo berbasis SVG Data URI beresolusi tinggi dan 100% aman offline
// Tidak bergantung pada hotlink Wikimedia/Unsplash sehingga tidak akan pernah rusak (broken image).

// 1. Logo Resmi SDN Lanto Dg. Pasewang (Perisai Biru Emas dengan Buku & Bintang)
export const DEFAULT_LOGO_SEKOLAH = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Outer Shield Frame -->
  <path d="M 120 15 C 175 15, 215 35, 215 75 C 215 155, 165 205, 120 225 C 75 205, 25 155, 25 75 C 25 35, 65 15, 120 15 Z" 
        fill="url(#goldGrad)" filter="url(#shadow)"/>
        
  <!-- Inner Shield -->
  <path d="M 120 23 C 168 23, 203 41, 203 76 C 203 148, 158 193, 120 213 C 82 193, 37 148, 37 76 C 37 41, 72 23, 120 23 Z" 
        fill="url(#shieldGrad)"/>

  <!-- Golden Stars (3 Bintang Keunggulan) -->
  <polygon points="120,40 123,48 131,48 125,53 127,61 120,56 113,61 115,53 109,48 117,48" fill="#fbbf24"/>
  <polygon points="90,48 92,54 99,54 94,58 96,65 90,61 84,65 86,58 81,54 88,54" fill="#fbbf24" opacity="0.85"/>
  <polygon points="150,48 152,54 159,54 154,58 156,65 150,61 144,65 146,58 141,54 148,54" fill="#fbbf24" opacity="0.85"/>

  <!-- Obor Pendidikan / Torch -->
  <path d="M 120 70 Q 128 85, 120 95 Q 112 85, 120 70 Z" fill="#ef4444"/>
  <path d="M 120 75 Q 125 85, 120 92 Q 115 85, 120 75 Z" fill="#fbbf24"/>
  <rect x="116" y="93" width="8" height="15" rx="2" fill="url(#goldGrad)"/>

  <!-- Open Book (Buku Terbuka) -->
  <path d="M 120 135 C 105 120, 70 120, 58 128 L 58 155 C 70 147, 105 147, 120 162 C 135 147, 170 147, 182 155 L 182 128 C 170 120, 135 120, 120 135 Z" 
        fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <path d="M 120 135 L 120 162" stroke="#94a3b8" stroke-width="2"/>
  
  <!-- Book Lines -->
  <line x1="68" y1="135" x2="110" y2="135" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>
  <line x1="68" y1="142" x2="110" y2="142" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>
  <line x1="130" y1="135" x2="172" y2="135" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>
  <line x1="130" y1="142" x2="172" y2="142" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>

  <!-- Laurel Wreath (Padi & Kapas) -->
  <path d="M 50 140 C 45 100, 70 70, 70 70" stroke="#facc15" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 190 140 C 195 100, 170 70, 170 70" stroke="#facc15" stroke-width="3" fill="none" stroke-linecap="round"/>

  <!-- Bottom School Ribbon Banner -->
  <path d="M 35 178 L 60 170 L 120 182 L 180 170 L 205 178 L 195 198 L 120 206 L 45 198 Z" 
        fill="#1e293b" stroke="url(#goldGrad)" stroke-width="1.5"/>
  <text x="120" y="195" font-family="Arial, sans-serif" font-size="10.5" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="1">
    SDN LANTO DG. PASEWANG
  </text>
  <text x="120" y="108" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.9">
    MAKASSAR
  </text>
</svg>
`)}`;

// 2. Logo Resmi Pemerintah Kota Makassar (Lambang Pemkot Makassar - Kapal Pinisi, Perisai, Bintang, Padi & Kapas)
export const DEFAULT_LOGO_MAKASSAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
  <defs>
    <linearGradient id="mksRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <linearGradient id="mksGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="seaBlue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>

  <!-- Shield Boundary -->
  <path d="M 120 20 C 180 20, 210 40, 210 90 C 210 160, 160 200, 120 220 C 80 200, 30 160, 30 90 C 30 40, 60 20, 120 20 Z" 
        fill="#ffffff" stroke="#991b1b" stroke-width="4"/>
  
  <!-- Red Upper Shield Half -->
  <path d="M 120 24 C 175 24, 204 42, 204 90 L 36 90 C 36 42, 65 24, 120 24 Z" fill="url(#mksRed)"/>
  
  <!-- Blue Sea Lower Half -->
  <path d="M 36 90 L 204 90 C 204 156, 156 194, 120 214 C 84 194, 36 156, 36 90 Z" fill="url(#seaBlue)"/>

  <!-- Golden Star on Top -->
  <polygon points="120,32 125,44 138,44 128,52 132,64 120,56 108,64 112,52 102,44 115,44" fill="url(#mksGold)" stroke="#854d0e" stroke-width="0.5"/>

  <!-- Perahu Pinisi Khas Makassar -->
  <!-- Hull -->
  <path d="M 65 145 C 90 165, 150 165, 175 145 L 165 155 C 145 170, 95 170, 75 155 Z" fill="#78350f"/>
  <!-- Mast & Rigging -->
  <line x1="105" y1="95" x2="105" y2="148" stroke="#451a03" stroke-width="2.5"/>
  <line x1="135" y1="90" x2="135" y2="148" stroke="#451a03" stroke-width="2.5"/>
  <!-- White Sails (Layar Pinisi) -->
  <path d="M 105 100 L 75 135 L 105 135 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
  <path d="M 105 105 L 125 135 L 105 135 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <path d="M 135 95 L 115 135 L 135 135 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
  <path d="M 135 98 L 165 135 L 135 135 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>

  <!-- Waves -->
  <path d="M 45 170 Q 60 165, 75 170 T 105 170 T 135 170 T 165 170 T 195 170" fill="none" stroke="#ffffff" stroke-width="2.5"/>
  <path d="M 55 180 Q 70 175, 85 180 T 115 180 T 145 180 T 175 180 T 190 180" fill="none" stroke="#e0f2fe" stroke-width="2"/>

  <!-- Padi & Kapas (Wreath) -->
  <path d="M 45 110 C 40 70, 60 50, 60 50" stroke="#facc15" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M 195 110 C 200 70, 180 50, 180 50" stroke="#facc15" stroke-width="3" fill="none" stroke-linecap="round"/>

  <!-- MAKASSAR Text Ribbon -->
  <rect x="50" y="196" width="140" height="18" rx="4" fill="#ffffff" stroke="#991b1b" stroke-width="1.5"/>
  <text x="120" y="210" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#991b1b" text-anchor="middle" letter-spacing="1.5">
    MAKASSAR
  </text>
</svg>
`)}`;

// 3. Logo Resmi Tut Wuri Handayani (Kemendikbudristek RI)
export const DEFAULT_LOGO_TUT_WURI = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
  <defs>
    <linearGradient id="kemendikbudBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="tutwuriGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>

  <!-- Outer Pentagon (Segi Lima Pendidikan Nasional) -->
  <polygon points="120,15 220,88 182,210 58,210 20,88" 
           fill="url(#kemendikbudBlue)" stroke="#ffffff" stroke-width="4"/>
  <polygon points="120,23 211,90 177,202 63,202 29,90" 
           fill="none" stroke="#facc15" stroke-width="2"/>

  <!-- Belencong / Api Obor Menyala (Golden Flame) -->
  <path d="M 120 42 C 132 60, 140 75, 120 98 C 100 75, 108 60, 120 42 Z" fill="#ef4444"/>
  <path d="M 120 50 C 127 63, 132 75, 120 92 C 108 75, 113 63, 120 50 Z" fill="url(#tutwuriGold)"/>

  <!-- Lampu Belencong / Cawan Wadah Api -->
  <path d="M 95 98 C 95 95, 145 95, 145 98 L 138 112 C 138 116, 102 116, 102 112 Z" fill="url(#tutwuriGold)"/>

  <!-- Sayap Garuda (Wings of Tut Wuri Handayani) -->
  <!-- Left Wings -->
  <path d="M 105 105 C 75 100, 48 120, 45 155 C 65 145, 85 145, 102 152 L 102 125 Z" fill="url(#tutwuriGold)"/>
  <path d="M 102 130 C 80 128, 60 142, 55 165 C 72 156, 88 156, 102 162 Z" fill="#fef08a"/>
  
  <!-- Right Wings -->
  <path d="M 135 105 C 165 100, 192 120, 195 155 C 175 145, 155 145, 138 152 L 138 125 Z" fill="url(#tutwuriGold)"/>
  <path d="M 138 130 C 160 128, 180 142, 185 165 C 168 156, 152 156, 138 162 Z" fill="#fef08a"/>

  <!-- Open Book Base (Buku Putih) -->
  <path d="M 120 152 C 108 144, 82 144, 68 150 L 70 172 C 84 165, 108 165, 120 175 C 132 165, 156 165, 170 172 L 172 150 C 158 144, 132 144, 120 152 Z" 
        fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="120" y1="152" x2="120" y2="175" stroke="#64748b" stroke-width="2"/>

  <!-- Ribbon Tut Wuri Handayani -->
  <path d="M 45 186 Q 120 200, 195 186 L 190 202 Q 120 216, 50 202 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
  <text x="120" y="199" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1">
    TUT WURI HANDAYANI
  </text>
</svg>
`)}`;
