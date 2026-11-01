import { useEffect, useState } from 'react'
import { getImageUrl } from '../utils/imageUrl'

function isPinterestPage(value) {
  return /(^|\/\/)(www\.)?(pinterest\.[^/]+|pin\.it)\//i.test(value)
}

export function RemoteImage({ src, alt, ...props }) {
  const resolvedSource = getImageUrl(src)
  const [imageSource, setImageSource] = useState(resolvedSource)

  useEffect(() => {
    let active = true
    setImageSource(resolvedSource)
    if (!resolvedSource || !isPinterestPage(resolvedSource)) return () => { active = false }

    const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(resolvedSource)}`
    fetch(oembedUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Pinterest image lookup failed with status ${response.status}.`)
        return response.json()
      })
      .then((data) => {
        if (active && data.thumbnail_url) setImageSource(data.thumbnail_url)
      })
      .catch((error) => {
        if (active) console.error('Unable to resolve Pinterest image URL.', error)
      })

    return () => { active = false }
  }, [resolvedSource])

  return <img src={imageSource} alt={alt} {...props} />
}
