export default {
  index(ctx: { body: { status: string } }) {
    ctx.body = { status: 'ok' };
  },
};
