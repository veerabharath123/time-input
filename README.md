# jQuery Time Input
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/veerabharath123/time-input)

A simple, lightweight jQuery plugin to create a masked input field for time in `HH:MM` format. It provides an intuitive user experience for time entry with built-in validation and keyboard controls.

## Features

- **Masked Input**: Enforces an `HH:MM` time format.
- **Keyboard Navigation**: Use arrow keys to move the cursor between hour and minute sections.
- **Input Handling**: Accepts only numeric digits and handles backspace correctly.
- **Smart Validation**: Validates hours (0-23) and minutes (0-59) on blur.
- **Copy & Paste**: Supports pasting time values, automatically formatting and validating them.
- **Custom Events**: Fires an `invalidTime` event when validation fails.
- **Customizable Max Hour**: Set the maximum hour for validation using a `data-` attribute.
- **Lightweight**: Minimal code with a single dependency on jQuery.

## Demo

For a live example, you can open the `demo/index.html` file in your browser.



## Setup

1.  **Include jQuery** in your project.
    ```html
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    ```

2.  **Include the Plugin Script**. Download `jquery-time-input.js` from the `assets/js/` directory and include it in your HTML.
    ```html
    <script src="path/to/assets/js/jquery-time-input.js"></script>
    ```

3.  **Add CSS (Recommended)** for better visual formatting.
    ```css
    .time-input {
      letter-spacing: 5px;
      text-align: center;
      width: 100px;
    }
    ```

## Usage

1.  Create a standard text input with a specific class, for example, `.time-input`.
    ```html
    <label for="my-time">Time:</label>
    <input type="text" id="my-time" class="time-input" value="10:30" />
    ```

2.  Initialize the plugin on your input element using jQuery.
    ```javascript
    $(document).ready(function() {
      $('.time-input').initTimeInput();
    });
    ```

## Customization

### Set Maximum Hour

By default, the plugin validates hours up to `24` (i.e., `23:59` is valid, but `24:01` is not). You can override this by adding a `data-maxhours` attribute to your input element.

```html
<!-- Example: Allow hours up to 12 (00:00 - 12:59) -->
<input type="text" class="time-input" data-maxhours="13" />
```

### Handling Invalid Time

The plugin fires a custom `invalidTime` event on the input element when it loses focus (`blur`) and its content is not a valid time. You can listen for this event to display error messages or implement custom logic.

```javascript
$('.time-input').on('invalidTime', function (event) {
  // The event detail contains an error message
  console.log('Event Triggered:', event.detail.message);
  alert('The time you entered is not valid!');
  
  // You can focus the element again if needed
  $(this).focus();
});
