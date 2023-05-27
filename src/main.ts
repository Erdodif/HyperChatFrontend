import './app.css'
import App from './routes/(app)/+page.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
