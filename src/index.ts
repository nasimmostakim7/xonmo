export default {
  async email(message, env, ctx) {
    try {
      // আসা ইমেইলটি জিমেইলে ফরওয়ার্ড হবে
      await message.forward("nasimmostakim7@gmail.com");

      // নোটিফিকেশন ইমেইল পাঠানো
      await env.SEND_EMAIL.send({
        from: "system@xonomo.site",
        to: "nasimmostakim7@gmail.com",
        subject: "New Email Alert | Xonomo.site",
        text: `From: ${message.from}\nTo: ${message.to}`
      });
    } catch (e) {
      console.error("Email error:", e);
    }
  }
};
