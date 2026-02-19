/**
 * Pure calculation functions – no DOM access, no side effects.
 */

export function computeMinMax(arr) {
  if (!arr || arr.length === 0) return { min: null, max: null }
  let min = arr[0], max = arr[0]
  for (const v of arr) {
    if (v < min) min = v
    if (v > max) max = v
  }
  return { min, max }
}

/**
 * PT1TT model response.
 * @param {{xa, dy, ks, tt, tg, t0}} params
 * @param {number[]} timeData
 * @returns {number[]}
 */
export function computeModelResponse({ xa, dy, ks, tt, tg, t0 }, timeData) {
  if (!isFinite(ks) || !isFinite(tt) || !isFinite(tg) || tg === 0) return []
  const tDelay = t0 + tt
  return timeData.map(t => {
    if (t <= tDelay) return xa
    return xa + ks * dy * (1 - Math.exp(-(t - tDelay) / tg))
  })
}

/**
 * Squared differences between two arrays (element-wise).
 */
export function computeSquaredDifferences(meas, model) {
  const n = Math.min(meas.length, model.length)
  const result = []
  for (let i = 0; i < n; i++) {
    const d = meas[i] - model[i]
    result.push(d * d)
  }
  return result
}

/**
 * Find the data point whose X value is closest to xTarget.
 */
function findNearestPoint(xData, timeData, xTarget) {
  let bestIndex = -1
  let bestDiff = Infinity
  for (let i = 0; i < xData.length; i++) {
    const diff = Math.abs(xData[i] - xTarget)
    if (diff < bestDiff) {
      bestDiff = diff
      bestIndex = i
    }
  }
  if (bestIndex < 0) return null
  return { X: xData[bestIndex], t: timeData[bestIndex] }
}

/**
 * Compute the Wendetangente from WP + surrounding data.
 *
 * Strategy (matches original):
 *   1. Use (xWP, tWP) as first tangent point.
 *   2. Find nearest data point to xWP + 5 % of (xe - xa) as second point.
 *   3. Compute line through both points → intercept at xa (t1) and xe (t2).
 *
 * @returns {{ a, b, t1, t2 } | null}
 */
export function computeTangentFromWP(xWP, tWP, xa, xe, xData, timeData) {
  if (![xWP, tWP, xa, xe].every(isFinite)) return null
  if (!xData || xData.length === 0) return null

  const xwp1 = xWP + 0.05 * (xe - xa)
  const pt2 = findNearestPoint(xData, timeData, xwp1)
  if (!pt2) return null

  const denom = pt2.t - tWP
  if (Math.abs(denom) < 1e-12) return null

  const a = (pt2.X - xWP) / denom
  const b = xWP - a * tWP

  const t1 = (xa - b) / a
  const t2 = (xe - b) / a

  return { a, b, t1, t2 }
}
