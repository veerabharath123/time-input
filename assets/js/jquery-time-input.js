(function ($) {
    $.fn.initTimeInput = function () {
    let setCharAt = (str,index,chr) => {
      if(index > str.length-1) return str;
      return str.substring(0,index) + chr + str.substring(index+1);
    }
    let HandleNumbers = (element, pos, event) => {
      const { key, which } = event;
      const newpos = (pos === 2) ? pos + 1 : pos;
      const input = /^\d+$/.test(key) ? key : String.fromCharCode(which);
      const value = setCharAt($(element).val(), newpos, input);

      $(element).val(value);
      element.setSelectionRange(newpos + 1, newpos + 1);
    };
    let HandleArrows = (element,pos,event) => {
      const newpos = (() => {
        switch (event.which) {
          case 37: return (pos === 3) ? pos - 1 : pos;
          case 39: return (pos === 1) ? pos + 1 : Math.min(4, pos);
          default: return pos;
        }
      })();
      element.setSelectionRange(newpos, newpos);
    }
    let HandleBackSpace = (element) => {
      const positions = { start: element.selectionStart, end: element.selectionEnd };
      if (positions.start === positions.end) {
        positions.start = Math.max(0, positions.start - 1);
        positions.end = 5;
      }
      const currentValue = $(element).val();
      const replacedValue = currentValue.substring(positions.start, positions.end).replace(/[0-9]/g, '_');
      const newValue = currentValue.substring(0, positions.start) + replacedValue;

      $(element).val(newValue);
      element.setSelectionRange(positions.start, positions.start);
    }
    let keysAllowed = (event) => {
      const allowedKeys = {
        isBackspace: event.which === 8,
        isArrow: [35, 37, 39, 36].includes(event.which),
        isNumber: ((event.which >= 48 && event.which <= 57) || /^\d$/.test(event.key)),
        isCopyPaste: (event.ctrlKey||event.metaKey) && [67,86].includes(event.which),
        isSelectAll: (event.ctrlKey||event.metaKey) && event.which === 65,
      }
      return allowedKeys;
    }
    let HandleInput = (element, event) => {
      const { isArrow, isBackspace, isNumber ,isCopyPaste , isSelectAll} = keysAllowed(event);
      if(isCopyPaste || isSelectAll) return true
      const pos = element.selectionStart;

      if (!isArrow) {
        event.preventDefault();
      }

      switch (true) {
        case isBackspace:
          return HandleBackSpace(element);
        case isArrow:
          return HandleArrows(element, pos, event);
        case isNumber:
          return HandleNumbers(element, pos, event);
        default:
          return;
      }
    };
    let validateHours = (element) => {
      let valid = true
      const value = $(element).val();
      const pattern = /^\d{2}:\d{2}$/;
      if (pattern.test(value) && /^\d{2}:[0-5]{1}\d$/.test(value)) {
        let [hours, minutes] = value.split(':').map(Number);
        let maxHours = parseInt($(element).data('maxhours')) || 24;
        if (hours >= maxHours && minutes > 0) {
          $(element).val('__:__').focus();
          valid = false
        }
      } else if(pattern.test(value)){
        $(element).val('__:__').focus();
        valid = false
      }
      return valid
    }
    let getMatchValue = (value,alternate) => {
      const match = value.match(/^\d{2}:[0-5]{1}\d$/);
      return match ? match[0] : alternate;
    }
    let css = {
      'letter-spacing':'5px',
      'text-align': 'center',
      'width':'100px'
    }
    $(this).attr('max-length',5).css(css)
    validateHours(this)
    return this.each(function () {      
      $(this).on({
        'keydown':function(e){
          HandleInput(this,e)
        },
        'focus':function(e){
          this.setSelectionRange(0, 0);
        },
        'drop dragstart paste copy':function(e){
          clipboardData = e.originalEvent?.clipboardData || e.clipboardData || window.clipboardData;
          if(e.type == 'paste'){
            const value = clipboardData?.getData('text') || '';
            $(this).val(getMatchValue(value,'__:__')).focus();
          } else if(e.type == 'copy'){
            const selectedText = window.getSelection().toString().replace(/\u200B/g, "");
            const extractedText = getMatchValue(selectedText,'')
            clipboardData.setData('text/html', extractedText);
            if(extractedText) return
          }
          e.stopPropagation()
          e.preventDefault()
        },
        'blur':function(e){
          if (!validateHours(this)) {
            let invalidTimeEvent = new CustomEvent('invalidTime', {
              detail: {
                message: 'Invalid time entered'
              },
              bubbles: true,
              cancelable: true
            });
            this.dispatchEvent(invalidTimeEvent);
          }
        }
      });
    });
  }
  })(jQuery);