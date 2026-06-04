import { DEV_PROJECTS } from './devProjects'
import { UIUX_PROJECTS } from './uiuxProjects'
import { PRODUCT_DESIGN_PROJECTS, pad } from './productDesignProjects'

export const ALL_PROJECTS = [
  ...DEV_PROJECTS,
  ...UIUX_PROJECTS,
  ...PRODUCT_DESIGN_PROJECTS,
]

export { pad }
