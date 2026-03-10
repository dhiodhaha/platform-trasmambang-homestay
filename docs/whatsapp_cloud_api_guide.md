# WhatsApp Cloud API Setup Guide

> [!NOTE]
> If you are considering using unofficial tools like **WAHA** to keep using your phone app, please read the [Comparison & Risk Guide](file:///Users/dhafin/trasmambang-platform/docs/whatsapp_api_comparison.md) first.

This guide outlines the step-by-step process to get access to the WhatsApp Cloud API and send message templates for Trasmambang Homestay.

---

## Phase 1: Create a Meta Developer App

1. **Go to Meta For Developers:** Visit [developers.facebook.com](https://developers.facebook.com/) and log in with your Facebook account.
2. **Create an App:**
    * Click on **"My Apps"** -> **"Create App"**.
    * Select **"Other"** -> **"Business"**.
    * Enter your App Name (e.g., "Trasmambang Platform").
    * Link it to a **Meta Business Portfolio** (Business Manager account).
    * Click **"Create App"**.

## Phase 2: Add WhatsApp to Your App

1. In the App Dashboard, find **"WhatsApp"** and click **"Set up"**.
2. Select your Meta Business Account and click **"Continue"**.
3. Meta will provide a **Test Number** and a **Temporary Access Token** (valid for 24 hours).

## Phase 3: Setup Test Environment

1. In the left sidebar, click **WhatsApp** -> **"API Setup"**.
2. Under "To", add and verify your personal WhatsApp number.
3. Use the sample `curl` command in Step 2 of the dashboard to send a "Hello World" message to your phone.

## Phase 4: Add Your Real Business Phone Number

> [!IMPORTANT]
> **The "One Platform" Rule:** A single phone number can only be registered on ONE WhatsApp platform at a time (Personal App, Business App, or Cloud API).
>
> If you want to use a number that is currently on the WhatsApp Business App:
>
> 1. You **MUST** delete the account from the App first (**Settings > Account > Delete my account**).
> 2. **Warning:** Deleting the account will permanently erase your message history on the app. Backup any important chats manually before doing this.
> 3. Once deleted, you can register it in the Meta Developer portal.

1. In **"API Setup"**, scroll to "Step 5: Add a phone number" and click **"Add phone number"**.
2. Fill in business details (Display Name, Category, etc.).
3. Verify the number via SMS or Voice call.

## Phase 5: Get a Permanent Access Token

1. Go to **[Meta Business Settings](https://business.facebook.com/settings)**.
2. Under **Users** -> **"System Users"**, click **"Add"** (Role: **Admin**).
3. Select the System User -> **"Add Assets"** -> **Apps** -> Select your App -> Toggle **"Manage App"** -> Save.
4. Click **"Generate New Token"**.
5. Select your App and the following scopes:
    * `whatsapp_business_messaging`
    * `whatsapp_business_management`
6. **Copy and save this token safely.** Use it as `WHATSAPP_TOKEN` in your `.env`.

## Phase 6: Create Message Templates

1. Open the [WhatsApp Manager](https://business.facebook.com/wa/manage/home/).
2. Go to **Account tools** -> **Message Templates**.
3. Click **"Create template"** (Category: `Utility`).
4. Use the templates defined in `docs/order_confirmation_template.md`.
5. Submit for approval.

## Phase 7: Integration Example (Next.js)

```javascript
const sendTemplateMessage = async (to, variables, paymentLink) => {
  const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: "waiting_for_payment",
      language: { code: "id" },
      components: [
        {
          type: "body",
          parameters: variables.map(v => ({ type: "text", text: v }))
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: paymentLink }]
        }
      ]
    }
  };

  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}
```
