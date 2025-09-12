export const isValidUrl = (url) => {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' +                     // optional http or https
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
        'localhost|' +                            // OR localhost
        '\\d{1,3}(\\.\\d{1,3}){3})' +              // OR IPv4
        '(\\:\\d+)?' +                             // optional port
        '(\\/[-a-zA-Z\\d%@_.~+&:]*)*' +            // optional path
        '(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?' +        // optional query string
        '(\\#[-a-zA-Z\\d_]*)?$',                   // optional fragment
        'i'
      );
      return !!pattern.test(url);
  }