export const readStorage = (key, fallback) => {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : fallback
}

export const writeStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))
