// @ts-nocheck

const EDITOR_ROLES = ['editor', 'administrator'];

export default async (ctx, _config, { strapi }) => {
  const user = ctx.state.user;
  if (!user) {
    return ctx.unauthorized("Tizimga kirish talab qilinadi.");
  }

  const role = user.role?.type;
  if (EDITOR_ROLES.includes(role)) return true;

  const articleId = ctx.params.id;
  if (!articleId) return true;

  const article = await strapi.db.query('api::article.article').findOne({
    where: { id: articleId },
    populate: ['author', 'author.user'],
  });

  if (!article) return ctx.notFound();
  if (article.author?.user?.id !== user.id) {
    return ctx.forbidden("Bu maqola sizga tegishli emas.");
  }

  return true;
};