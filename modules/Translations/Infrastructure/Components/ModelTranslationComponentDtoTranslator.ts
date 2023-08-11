import { ModelTranslationsApplicationDto } from '~/modules/Translations/Application/ModelTranslationsApplicationDto'
import {
  ModelTranslationComponentDto
} from '~/modules/Translations/Infrastructure/Components/ModelTranslationComponentDto'

export class ModelTranslationComponentDtoTranslator {
  public static fromApplication (modelTranslation: ModelTranslationsApplicationDto): ModelTranslationComponentDto {
    return modelTranslation
  }
}
