const masked = ['PGPASSWORD']

export const env = {
  NODE_ENV: undefined,
  PORT: 3000,
  POSTGRES_CONNECTION: 'postgresql://postgres:test@localhost:5432',
  POSTGRES_DATABASE: 'test',
}
export const defaults = {...env}

export const refresh = () => {
  Object.keys(env).forEach(key => {
    const value = process.env[key] ?? env[key];
    env[key] = value;
  })
}

export const display = () => {
  console.log(`
#-----------------------------------------------------------------------------
# Environment Variables
#-----------------------------------------------------------------------------
`)
  Object.keys(env).forEach(key => {
    const value = process.env[key] ?? defaults[key];
    const isDefault = defaults[key] === value || !process.env[key];
    const isMasked = masked.includes(key);
    console.log(`${isDefault ? '# ': ''}${key}=${isMasked ? '***masked***' : value}`)
  })
  console.log('\n')
}

refresh();

export default env
