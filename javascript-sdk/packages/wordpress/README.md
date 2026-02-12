# @apolopay-sdk/wordpress-plugin

WordPress integration for the Apolo Pay SDK. Provides a simple Shortcode to integrate the Apolo Pay payment button into any WordPress page or post.

## Installation

Unlike the other packages in this SDK, this is a WordPress Plugin that must be installed via the Admin Panel.

### 1. Build the Plugin

If you are developing inside the monorepo, run the build command to generate the `.zip` file:

```bash
# From the root of the monorepo
turbo run build --filter=@apolo-pay/wordpress-plugin
```

This will create a file named `apolo-pay-plugin.zip` inside the `packages/wordpress` directory.

### 2. Upload to WordPress

1. Go to your WordPress Admin Panel (`/wp-admin`).
2. Navigate to **Plugins** > **Add New**.
3. Click **Upload Plugin** at the top.
4. Select the `apolo-pay-plugin.zip` file you just generated.
5. Click **Install Now** and then **Activate**.

## Usage

You can use the Apolo Pay button in any Page, Post, or Text Widget using the `[apolo_button]` shortcode.

### Basic Example

Add this shortcode to your content editor:

```text
[apolo_button 
  public_key="pk_test_123456" 
  process_id="proc_abcdef123" 
  label="Pay Now"
]
```

### Full Example with Attributes

```text
[apolo_button 
  public_key="pk_live_987654"
  process_id="proc_xyz789"
  label="Buy Order #101"
  theme="dark"
  lang="en"
  email="customer@example.com"
  amount="150.00"
]
```

## Shortcode Attributes

The `[apolo_button]` shortcode accepts the following parameters. These map directly to the Web Component attributes.

| Attribute     | Description                                        | Example           |
| :------------ | :------------------------------------------------- | :---------------- |
| `public_key`  | **Required**. Your Apolo Pay Public Key.           | `pk_test_...`     |
| `process_id`  | **Required**. The unique ID of the payment process.| `proc_123...`     |
| `label`       | Text to display on the button.                     | `Pay $100`        |
| `theme`       | Button theme (`light` or `dark`).                  | `dark`            |
| `lang`        | Language for the UI (`es`, `en`).                  | `es`              |
| `email`       | Pre-fill user email (optional).                    | `user@test.com`   |
| `amount`      | Payment amount (optional display).                 | `100.00`          |

## Handling Events (Advanced)

Since WordPress Shortcodes are static HTML, you cannot pass JavaScript functions directly in the editor (like `@success` in Vue). 

To handle payment events (like redirects or analytics), you must add a JavaScript listener in your theme's footer or a custom JS file.

### Example Script

You can add this script to your site's footer or inside a Custom HTML block:

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Select the button element
    const button = document.querySelector('payment-button');

    if (button) {
      // Handle Success Event
      button.addEventListener('success', (event) => {
        console.log('Payment successful!', event.detail);
        // Example: Redirect to a thank you page
        // window.location.href = '/thank-you?id=' + event.detail.transactionId;
      });

      // Handle Error Event
      button.addEventListener('error', (event) => {
        console.error('Payment failed:', event.detail);
        alert('There was an error processing your payment.');
      });
    }
  });
</script>
```

## License

MIT