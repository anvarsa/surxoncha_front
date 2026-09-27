'use strict';

const DEMO_ARTICLES = [
  {
    title: 'Demo: Termizda yoshlar media laboratoriyasi ish boshladi',
    contentType: 'news',
    category: 'yangiliklar',
    region: 'termiz-shahri',
    excerpt: 'Yosh muxbirlar uchun yangi media laboratoriyada video, foto va mobil jurnalistika mashgulotlari boshlandi.',
    content: 'Bu demo maqola SURXONCHA.UZ platformasining nashr oqimini ko‘rsatish uchun yaratildi. Media laboratoriyada yoshlar reportaj tayyorlash, intervyu olish va materialni tahririyatga yuborishni o‘rganadi.',
    featured: true,
    viewCount: 128,
  },
  {
    title: 'Demo: Denovdagi kichik bizneslar yangi imkoniyatlarni izlamoqda',
    contentType: 'business',
    category: 'biznes',
    region: 'denov',
    excerpt: 'Mahalliy tadbirkorlar raqamli savdo va yangi xizmatlar orqali mijozlar doirasini kengaytirmoqda.',
    content: 'Demo reportaj: Denovdagi tadbirkorlar o‘z tajribasi, muammolari va kelajak rejalari haqida gapirdi. Ushbu matn saytning biznes kategoriyasi qanday ishlashini ko‘rsatadi.',
    viewCount: 94,
  },
  {
    title: 'Demo: Surxondaryoda mobil fotografiya kuni',
    contentType: 'reportage',
    category: 'reportaj',
    region: 'sherobod',
    excerpt: 'Fotograflar va yosh ijodkorlar viloyat manzaralarini telefon kamerasi orqali hujjatlashtirdi.',
    content: 'Demo reportaj materiali: ishtirokchilar yorug‘lik, kompozitsiya va hikoya qurish usullarini amalda sinab ko‘rdi. Foto bo‘limi va maqola sahifasi uchun namunaviy kontent.',
    viewCount: 76,
  },
  {
    title: 'Demo: Yoshlar bilan ochiq suhbat',
    contentType: 'interview',
    category: 'intervyu',
    region: 'boysun',
    excerpt: 'Boysunlik yoshlar ta’lim, ijod va mahalliy loyihalar haqida fikr bildirdi.',
    content: 'Demo intervyu: yoshlar o‘z hududida qanday o‘zgarishlarni ko‘rishni istashi, media va ta’limning o‘rni haqida suhbatlashdi.',
    viewCount: 61,
  },
  {
    title: 'Demo: O‘quvchilar uchun raqamli hikoya tanlovi',
    contentType: 'youth',
    category: 'yoshlar',
    region: 'angor',
    excerpt: 'Maktab o‘quvchilari o‘z mahallasidagi qiziqarli voqealarni qisqa video va foto hikoyalarga aylantiradi.',
    content: 'Demo yoshlar materiali: tanlov ishtirokchilari mobil telefon yordamida hikoya tayyorlab, tahririyatga yuboradi. Bu material submit va editorial workflow uchun namuna sifatida ishlatiladi.',
    viewCount: 48,
  },
  {
    title: 'Demo: Termizdagi ta’lim innovatsiyalari',
    contentType: 'news',
    category: 'talim',
    region: 'termiz-shahri',
    excerpt: 'Maktablar va kollejlar yangi texnologik usullar orqali o‘qitishni yanada samarali qilishga harakat qilmoqda.',
    content: 'Demo ta’lim maqolasi: o‘qituvchilar, o‘quvchilar va ota-onalar o‘rta maktabda zamonaviy pedagogika va digital vositalardan qanday foydalanish haqida fikr almashdilar.',
    viewCount: 55,
  },
  {
    title: 'Demo: Boysun madaniyati va an’analarni saqlab qolish',
    contentType: 'news',
    category: 'madaniyat',
    region: 'boysun',
    excerpt: 'Mahalliy an’ana va san’at namoyondalari yosh avlodga madaniy merosni yetkazishda muhim rol o‘ynamoqda.',
    content: 'Demo madaniyat materialida Boysun hududidagi festivallar, xalq ijodi va an’anaviy amaliyotlar haqida hikoya qilinadi.',
    viewCount: 44,
  },
  {
    title: 'Demo: Surxondaryo sport maktablari yangi yutuqlarni qidirmoqda',
    contentType: 'news',
    category: 'sport',
    region: 'termiz-shahri',
    excerpt: 'Yosh sportchilar, trenerlar va mahalliy jamoalar yangi qadamlar bilan viloyat sportini ilgari surmoqda.',
    content: 'Demo sport maqolasi: sport tadbirlari, maktab musobaqalari va yosh sportchilarning intilishlari haqida qisqa va ta’sirli hikoya.',
    viewCount: 67,
  },
  {
    title: 'Demo: Mahalliy jamiyatda ko‘ngilli kadrlar ko‘paymoqda',
    contentType: 'news',
    category: 'jamiyat',
    region: 'sherobod',
    excerpt: 'Ko‘ngilli faollar mahalla muammolari va ijtimoiy loyihalar ustida ishlash orqali keng jamoani birlashtirmoqda.',
    content: 'Demo jamiyat maqolasi: ko‘ngilli tashkilotlar, mahalla faollari va yoshlar o‘rtasidagi hamkorlikni ko‘rsatadi.',
    viewCount: 52,
  },
  {
    title: 'Demo: Denovdagi texnologik startaplar yangi bosqichga chiqdi',
    contentType: 'news',
    category: 'texnologiya',
    region: 'denov',
    excerpt: 'Dasturchilar va tadbirkorlar logistik, ta’lim va savdo sohalarida yangi texnologiyalarni joriy qilmoqda.',
    content: 'Demo texnologiya maqolasi: mahalliy startaplar va digital platformalar viloyatdagi kichik bizneslarni qanday rivojlantirishga yordam berayotganini yoritadi.',
    viewCount: 58,
  },
];

const DEMO_PHOTOS = [
  ['Demo story: Termiz tongi', 'Surxondaryoning tonggi ko‘rinishi haqida qisqa foto hikoya.', 'instagram'],
  ['Demo story: Boysun yo‘llari', 'Boysun yo‘llaridagi kundalik hayotdan bir kadr.', 'telegram'],
  ['Demo photo: Yosh muxbirlar', 'Media laboratoriyada amaliy mashg‘ulotdan lavha.', 'upload'],
  ['Demo photo: Mahalla ovozi', 'Mahalladagi ochiq suhbatdan foto lavha.', 'instagram'],
];

const DEMO_VIDEOS = [
  ['Demo video: Surxoncha newsroom tour', 'Tahririyat va yosh muxbirlar ish jarayoni bilan tanishing.', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
  ['Demo video: Boysun reportaji', 'Boysun hududidan qisqa video reportaj namunasi.', 'telegram', 'https://t.me/surxoncha_uz'],
  ['Demo video: Mobil jurnalistika', 'Telefon bilan reportaj tayyorlash bo‘yicha qisqa maslahatlar.', 'instagram', 'https://www.instagram.com/'],
];

const DEMO_REGIONS = ['Termiz shahri', 'Angor', 'Denov', 'Boysun', 'Sherobod', 'Uzun'];
const DEMO_CATEGORIES = [
  'Yangiliklar',
  'Intervyu',
  'Reportaj',
  'Biznes',
  'Yoshlar',
  "Ta'lim",
  'Madaniyat',
  'Sport',
  'Jamiyat',
  'Texnologiya',
];

function slugify(value) {
  return value.toLowerCase().replace(/[’‘']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function findOrCreate(strapi, uid, where, data) {
  const existing = await strapi.db.query(uid).findOne({ where });
  if (existing) return existing;
  return strapi.db.query(uid).create({ data });
}

async function seedDemoData(strapi) {
  const file = await strapi.db.query('plugin::upload.file').findOne({ orderBy: { createdAt: 'asc' } });
  if (!file) {
    strapi.log.warn('[demo] Upload fayli topilmadi — media demo yozuvlari keyingi restartda yaratiladi.');
    return;
  }

  let user = await strapi.db.query('plugin::users-permissions.user').findOne({ orderBy: { id: 'asc' } });
  if (!user) {
    const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });
    user = await strapi.plugin('users-permissions').service('user').add({
      username: 'demo-user',
      email: 'demo@surxoncha.uz',
      password: 'DemoUser2026StrongPassword!',
      confirmed: true,
      blocked: false,
      role: role?.id,
    });
    strapi.log.info('[demo] Demo user yaratildi: demo@surxoncha.uz');
  }

  const demoRegions = {};
  for (const name of DEMO_REGIONS) {
    const slug = slugify(name);
    let region = await strapi.db.query('api::region.region').findOne({ where: { slug } });
    if (!region) {
      region = await strapi.db.query('api::region.region').findOne({
        where: { slug: `demo-${slug}` },
      });
    }
    if (region && region.slug !== slug) {
      region = await strapi.db.query('api::region.region').update({
        where: { id: region.id },
        data: { name, slug },
      });
    }
    if (!region) {
      region = await findOrCreate(strapi, 'api::region.region', { slug }, {
        name,
        slug,
        description: `${name} uchun demo hudud ma'lumoti.`,
        featured: name === 'Termiz shahri',
        publishedAt: new Date(),
      });
    }
    demoRegions[slug] = region;
  }
  const region = demoRegions['termiz-shahri'];

  const demoCategories = {};
  for (const name of DEMO_CATEGORIES) {
    const slug = slugify(name);
    let category = await strapi.db.query('api::category.category').findOne({ where: { slug } });
    if (!category) {
      category = await strapi.db.query('api::category.category').findOne({
        where: { slug: `demo-${slug}` },
      });
    }
    if (category && category.slug !== slug) {
      category = await strapi.db.query('api::category.category').update({
        where: { id: category.id },
        data: { name, slug },
      });
    }
    if (!category) {
      category = await findOrCreate(strapi, 'api::category.category', { slug }, {
        name,
        slug,
        description: `${name} uchun demo kategoriya ma'lumoti.`,
        publishedAt: new Date(),
      });
    }
    demoCategories[slug] = category;
  }
  const author = await findOrCreate(
    strapi,
    'api::author-profile.author-profile',
    { username: 'demo-muxbir' },
    {
      username: 'demo-muxbir',
      displayName: 'Demo Muxbir',
      bio: 'SURXONCHA.UZ demo materiallari uchun namunaviy muxbir profili.',
      communityRole: 'reporter',
      mediaInterests: ['journalism', 'photography', 'videography'],
      joinedAt: new Date(),
      user: user.id,
    }
  );

  const categories = {};
  const regions = {};
  for (const item of DEMO_ARTICLES) {
    categories[item.category] = demoCategories[item.category];
    regions[item.region] = demoRegions[item.region] || region;
  }

  const tags = {};
  for (const name of ['demo', 'surxoncha', 'yoshlar', 'media']) {
    const slug = `demo-${slugify(name)}`;
    tags[name] = await findOrCreate(strapi, 'api::tag.tag', { slug }, { name: `Demo ${name}`, slug });
  }

  const articles = [];
  for (const item of DEMO_ARTICLES) {
    const slug = `demo-${slugify(item.title)}`;
    let article = await strapi.db.query('api::article.article').findOne({ where: { slug } });
    if (!article) {
      article = await strapi.db.query('api::article.article').create({
        data: {
          title: item.title,
          slug,
          excerpt: item.excerpt,
          content: item.content,
          coverImage: file.id,
          contentType: item.contentType,
          category: categories[item.category]?.id,
          region: regions[item.region]?.id || region?.id,
          author: author.id,
          tags: [tags.demo.id, tags.surxoncha.id],
          status: 'draft',
          viewCount: item.viewCount,
          featured: false,
          breaking: false,
          readingTime: 2,
          source: 'SURXONCHA.UZ demo seed',
        },
      });
      await strapi.db.query('api::article.article').update({
        where: { id: article.id },
        data: { status: 'published', publishedAt: new Date(), featured: Boolean(item.featured) },
      });
      article = await strapi.db.query('api::article.article').findOne({ where: { id: article.id } });
    }
    articles.push(article);
  }

  const setting = await strapi.db.query('api::site-setting.site-setting').findOne();
  const settingData = {
    siteName: 'SURXONCHA.UZ',
    tagline: 'Surxondaryoni uning o‘z yoshlari hikoya qiladi.',
    contactEmail: 'hello@surxoncha.uz',
    contactPhone: '+998 90 000 00 00',
    telegramUrl: 'https://t.me/surxoncha_uz',
    instagramUrl: 'https://www.instagram.com/surxoncha.uz/',
    youtubeUrl: 'https://www.youtube.com/@surxoncha',
    xUrl: 'https://x.com/surxoncha_uz',
    footerText: 'Surxondaryo yangiliklari, yoshlar va mahalliy hikoyalar.',
    copyrightText: '© 2026 SURXONCHA.UZ',
    defaultSeo: {
      metaTitle: 'SURXONCHA.UZ — Surxondaryo media platformasi',
      metaDescription: 'Surxondaryo yangiliklari, intervyular, reportajlar va yoshlar hikoyalari.',
      ogType: 'website',
      noIndex: false,
    },
  };
  if (!setting) {
    await strapi.db.query('api::site-setting.site-setting').create({ data: settingData });
  } else {
    await strapi.db.query('api::site-setting.site-setting').update({ where: { id: setting.id }, data: settingData });
  }

  for (const [index, item] of DEMO_PHOTOS.entries()) {
    const slug = `demo-${slugify(item[0])}`;
    await findOrCreate(strapi, 'api::photo.photo', { slug }, {
      title: item[0], slug, description: item[1], image: file.id, platform: item[2], sourceUrl: item[2] === 'upload' ? undefined : 'https://t.me/surxoncha_uz', isStory: true, featured: index === 0, publishedAt: new Date(),
    });
  }

  for (const item of DEMO_VIDEOS) {
    const slug = `demo-${slugify(item[0])}`;
    await findOrCreate(strapi, 'api::video.video', { slug }, {
      title: item[0], slug, description: item[1], platform: item[2], sourceUrl: item[3], thumbnail: file.id, featured: false, publishedAt: new Date(),
    });
  }

  if (region) {
    await findOrCreate(strapi, 'api::contact-message.contact-message', { email: 'demo@surxoncha.uz' }, {
      name: 'Demo Foydalanuvchi', email: 'demo@surxoncha.uz', subject: 'editorial', message: 'Demo aloqa xabari: tahririyatga yuborilgan namunaviy murojaat.', resolved: false,
    });
    await findOrCreate(strapi, 'api::contributor-application.contributor-application', { fullName: 'Demo Muxbir' }, {
      applicant: user.id, fullName: 'Demo Muxbir', region: region.id, experience: 'Demo application uchun namunaviy jurnalistika tajribasi.', specialization: ['journalism', 'photography'], motivation: 'Surxondaryo hikoyalarini sifatli media materiallarga aylantirish.', status: 'pending',
    });
  }

  const publishedArticle = articles.find((item) => item?.status === 'published') || articles[0];
  if (publishedArticle && author) {
    await findOrCreate(strapi, 'api::editorial-action.editorial-action', { note: `demo-publish-${publishedArticle.id}` }, {
      article: publishedArticle.id, editor: author.id, action: 'publish', note: `demo-publish-${publishedArticle.id}`,
    });
  }

  strapi.log.info('[demo] Demo content: articles, media, site settings, tags, contact, application va editorial log tayyor.');
}

module.exports = { seedDemoData };
