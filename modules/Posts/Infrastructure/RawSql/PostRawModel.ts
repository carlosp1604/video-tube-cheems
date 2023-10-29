export interface PostRawModel {
  id: string
  title: string
  type: string
  description: string
  slug: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  published_at: Date | null
  producer_id: string | null
  actor_id: string | null
}

export interface PostProducerRawModel {
  producer_id: string
  producer_name: string
  producer_description: string
  producer_parent_producer_id: string | null
  producer_image_url: string | null
  producer_brand_hex_color: string
  producer_created_at: Date
  producer_updated_at: Date
  producer_deleted_at: Date | null
}

export interface PostPostMetaRawModel {
  meta_type: string
  meta_value: string
  meta_post_id : string
  meta_created_at: Date
  meta_updated_at: Date
  meta_deleted_at: Date | null
}

export interface PostActorRawModel {
  actor_id: string
  actor_name: string
  actor_description: string
  actor_image_url: string | null
  actor_created_at: Date
  actor_updated_at: Date
  actor_deleted_at: Date | null
}

export interface PostTranslationRawModel {
  translation_translatable_id: string
  translation_field: string
  translation_value: string
  translation_translatable_type: string
  translation_language: string
  translation_created_at: Date
  translation_updated_at: Date
}

export type PostWithRelationsRawModel =
  PostRawModel &
  (PostProducerRawModel | undefined) &
  (PostActorRawModel | undefined) &
  (PostPostMetaRawModel | undefined) &
  (PostTranslationRawModel | undefined)
