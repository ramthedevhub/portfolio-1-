/**
 * Loads an animation stored as one or more horizontal image strips (WebP caps one image at
 * 16,383 px wide, so long clips are split). Frames are numbered continuously across the strips.
 *
 *   const frames = await loadFrames([{ src: '/images/a.webp', count: 53 }, ...], 234, 320)
 *   frames.draw(ctx, 12)      // draw frame 12 at 0,0
 */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => (img.decode ? img.decode().then(() => resolve(img), () => resolve(img)) : resolve(img))
    img.onerror = reject
    img.src = src
  })

export async function loadFrames(strips, frameWidth, frameHeight) {
  const images = await Promise.all(strips.map((strip) => loadImage(strip.src)))
  const lookup = []
  strips.forEach((strip, s) => {
    for (let k = 0; k < strip.count; k++) lookup.push([s, k])
  })
  return {
    count: lookup.length,
    draw(ctx, index, dx = 0, dy = 0) {
      const [s, k] = lookup[index]
      ctx.drawImage(images[s], k * frameWidth, 0, frameWidth, frameHeight, dx, dy, frameWidth, frameHeight)
    },
  }
}
