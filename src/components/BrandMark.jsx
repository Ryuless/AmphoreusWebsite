export function BrandMark({ small = false }) {
  return (
    <span className={small ? 'mark mark--small' : 'mark'} aria-hidden="true">
      <svg className="mark__chalice" viewBox="0 0 120 130" focusable="false">
        <path className="chalice__bowl" d="M16 20C28 25 92 25 104 20L98 64C96 78 87 88 77 94C69 99 51 99 43 94C33 88 24 78 22 64Z" />
        <path className="chalice__rim" d="M15 20C24 14 96 14 105 20C97 27 23 27 15 20Z" />
        <path className="chalice__band" d="M18 30C30 35 90 35 102 30" />
        <path className="chalice__band" d="M20 70C32 75 88 75 100 70" />
        <path className="chalice__ornament" d="M31 40C27 47 27 57 34 64C37 56 40 48 47 40C44 50 42 60 48 68" />
        <path className="chalice__ornament" d="M89 40C93 47 93 57 86 64C83 56 80 48 73 40C76 50 78 60 72 68" />
        <path className="chalice__ornament" d="M52 45C55 40 65 40 68 45C72 51 70 61 60 67C50 61 48 51 52 45Z" />
        <path className="chalice__ornament" d="M56 47C57 52 57 59 60 64C63 59 63 52 64 47" />
        <path className="chalice__stem" d="M43 94C46 101 51 103 51 108C51 112 46 114 43 116C51 120 69 120 77 116C74 114 69 112 69 108C69 103 74 101 77 94" />
        <ellipse className="chalice__knob" cx="60" cy="109" rx="17" ry="7" />
        <path className="chalice__foot" d="M43 116C36 120 29 123 22 126C35 132 85 132 98 126C91 123 84 120 77 116C68 120 52 120 43 116Z" />
        <path className="chalice__foot-detail" d="M34 124C40 126 80 126 86 124M45 119C47 124 48 127 48 129M75 119C73 124 72 127 72 129" />
      </svg>
      <span className="mark__ring mark__ring--one" />
      <span className="mark__ring mark__ring--two" />
    </span>
  )
}
