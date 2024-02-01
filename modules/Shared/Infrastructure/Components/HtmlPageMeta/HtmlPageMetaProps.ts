import { HtmlPageMetaContextProps } from './HtmlPageMetaContextProps'
import {
  HtmlPageMetaResourceProps
} from './HtmlPageMetaResourceService/HtmlPageMetaResourceProps'

export interface HtmlPageMetaProps extends HtmlPageMetaContextProps {
  resourceProps: HtmlPageMetaResourceProps
  structuredData?: string
}
