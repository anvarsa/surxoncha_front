import type { Schema, Struct } from '@strapi/strapi';

export interface ArticleCorrectionNote extends Struct.ComponentSchema {
  collectionName: 'components_article_correction_notes';
  info: {
    displayName: 'Correction Note';
    icon: 'pencil';
  };
  attributes: {
    correctedAt: Schema.Attribute.DateTime & Schema.Attribute.Required;
    editor: Schema.Attribute.Relation<
      'oneToOne',
      'api::author-profile.author-profile'
    >;
    note: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ArticleGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_article_gallery_images';
  info: {
    displayName: 'Gallery Image';
    icon: 'images';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogType: Schema.Attribute.Enumeration<['article', 'website']> &
      Schema.Attribute.DefaultTo<'article'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'article.correction-note': ArticleCorrectionNote;
      'article.gallery-image': ArticleGalleryImage;
      'shared.seo': SharedSeo;
    }
  }
}
