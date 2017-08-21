var Postal = (function() {
  'use strict';

  /** @type {!Array<string>} */
  const countryCodes = [
    'AC',
    'AD',
    'AE',
    'AF',
    'AG',
    'AI',
    'AL',
    'AM',
    'AO',
    'AQ',
    'AR',
    'AS',
    'AT',
    'AU',
    'AW',
    'AX',
    'AZ',
    'BA',
    'BB',
    'BD',
    'BE',
    'BF',
    'BG',
    'BH',
    'BI',
    'BJ',
    'BL',
    'BM',
    'BN',
    'BO',
    'BQ',
    'BR',
    'BS',
    'BT',
    'BV',
    'BW',
    'BY',
    'BZ',
    'CA',
    'CC',
    'CD',
    'CF',
    'CG',
    'CH',
    'CI',
    'CK',
    'CL',
    'CM',
    'CN',
    'CO',
    'CR',
    'CV',
    'CW',
    'CX',
    'CY',
    'CZ',
    'DE',
    'DJ',
    'DK',
    'DM',
    'DO',
    'DZ',
    'EC',
    'EE',
    'EG',
    'EH',
    'ER',
    'ES',
    'ET',
    'FI',
    'FJ',
    'FK',
    'FM',
    'FO',
    'FR',
    'GA',
    'GB',
    'GD',
    'GE',
    'GF',
    'GG',
    'GH',
    'GI',
    'GL',
    'GM',
    'GN',
    'GP',
    'GQ',
    'GR',
    'GS',
    'GT',
    'GU',
    'GW',
    'GY',
    'HK',
    'HM',
    'HN',
    'HR',
    'HT',
    'HU',
    'ID',
    'IE',
    'IL',
    'IM',
    'IN',
    'IO',
    'IQ',
    'IR',
    'IS',
    'IT',
    'JE',
    'JM',
    'JO',
    'JP',
    'KE',
    'KG',
    'KH',
    'KI',
    'KM',
    'KN',
    'KR',
    'KW',
    'KY',
    'KZ',
    'LA',
    'LB',
    'LC',
    'LI',
    'LK',
    'LR',
    'LS',
    'LT',
    'LU',
    'LV',
    'LY',
    'MA',
    'MC',
    'MD',
    'ME',
    'MF',
    'MG',
    'MH',
    'MK',
    'ML',
    'MM',
    'MN',
    'MO',
    'MP',
    'MQ',
    'MR',
    'MS',
    'MT',
    'MU',
    'MV',
    'MW',
    'MX',
    'MY',
    'MZ',
    'NA',
    'NC',
    'NE',
    'NF',
    'NG',
    'NI',
    'NL',
    'NO',
    'NP',
    'NR',
    'NU',
    'NZ',
    'OM',
    'PA',
    'PE',
    'PF',
    'PG',
    'PH',
    'PK',
    'PL',
    'PM',
    'PN',
    'PR',
    'PS',
    'PT',
    'PW',
    'PY',
    'QA',
    'RE',
    'RO',
    'RS',
    'RU',
    'RW',
    'SA',
    'SB',
    'SC',
    'SE',
    'SG',
    'SH',
    'SI',
    'SJ',
    'SK',
    'SL',
    'SM',
    'SN',
    'SO',
    'SR',
    'SS',
    'ST',
    'SV',
    'SX',
    'SZ',
    'TA',
    'TC',
    'TD',
    'TF',
    'TG',
    'TH',
    'TJ',
    'TK',
    'TL',
    'TM',
    'TN',
    'TO',
    'TR',
    'TT',
    'TV',
    'TW',
    'TZ',
    'UA',
    'UG',
    'UM',
    'US',
    'UY',
    'UZ',
    'VA',
    'VC',
    'VE',
    'VG',
    'VI',
    'VN',
    'VU',
    'WF',
    'WS',
    'XK',
    'YE',
    'YT',
    'ZA',
    'ZM',
    'ZW',
  ];

  /** @constructor */
  function Postal() {

  }

  /** @type {!string} */
  Postal.prototype.UseOnlineData = true;

  /** @type {!Object} */
  Postal.prototype.AddressMetadata = {
    BaseUrl: 'https://chromium-i18n.appspot.com/ssl-address/'
  };

  Postal.prototype.parseAddress = function(address, countryCode) {
    if (countryCodes.indexOf(countryCode.toUpperCase()) > -1) {
      // if(this.UseOnlineData) {
      //   var req = new XMLHttpRequest();
      //   req.open("GET", baseAddress.concat(countryCode.toUpperCase()), false);
      //   req.send();
      //   console.dir(req.responseText);
      // }
      var country_meta = this.AddressMetadata[countryCode];
      this.AddressComponents.CountryCode = country_meta.key;
      this.AddressComponents.Country = country_meta.name;
      var zip_candidate = address.match(new RegExp(country_meta.zip, "g"));
      if(zip_candidate !== null) {
        switch(zip_candidate.length) {
          case 0:
            break;
          case 1:
            this.AddressComponents.Postcode = zip_candidate[0];
            break;
          default:
            if(country_meta.hasOwnProperty('sub_keys')) {
              address = address.toUpperCase()
                .replace(country_meta.name, "");
              address = address.toLocaleUpperCase()
                  .replace(new RegExp(" "+country_meta.key+"( |$)"), "");
              var fmt = 'fmt';
              if(country_meta.hasOwnProperty('lfmt')) {
                fmt = 'lfmt';
              }
              var addr_fmt = country_meta[fmt];
              if(addr_fmt.startsWith("%Z")) {
                for(var i=0;i<zip_candidate.length;i++) {
                  if(address.startsWith(zip_candidate[i])) {
                    this.AddressComponents.Postcode = zip_candidate[i];
                    break;
                  }
                }
              } else if(addr_fmt.endsWith("%Z")) {
                for(i=0;i<zip_candidate.length;i++) {
                  if(address.endsWith(zip_candidate[i])) {
                    this.AddressComponents.Postcode = zip_candidate[i];
                    break;
                  }
                }
              } else {
                var addr_fmt_comp = addr_fmt.match(new RegExp("(.*)(%Z)(.*)"));
                var s = addr_fmt_comp[1].replace(new RegExp("\\S+", "g"), '.*');
                var e = addr_fmt_comp[3].replace(new RegExp("\\S+", "g"), '.*');
                for(i=0;i<zip_candidate.length;i++) {
                  if(address.match(new RegExp(s+zip_candidate[i]+e))) {
                    this.AddressComponents.Postcode = zip_candidate[i];
                    break;
                  }
                }
              }
            } else {
              break;
            }
        }
      }
    }
    return this;
  };

  Postal.prototype.validateAddress = function() {
    if(!this.AddressComponents.hasOwnProperty('CountryCode')) {
      this.AddressComponents.valid = false;
    }
    return this;
  };

  Postal.prototype.getAddressComponents = function() {
    return this.AddressComponents;
  };

  Postal.prototype.downloadMetadata = function(deep) {
    var recursive = (typeof deep === 'undefined') ? true : deep;
    function putData(parent, key, evt) {
      parent[key] = JSON.parse(evt.target.responseText);
      if(recursive && parent[key].hasOwnProperty('sub_keys')) {
        /** @type {!Array<string>} */
        var subKeys = parent[key].sub_keys.split('~');
        for (var j = 0; j < subKeys.length; j++) {
          http = new XMLHttpRequest();
          http.addEventListener("load", putData.bind(
              null, parent[key], subKeys[j]), false
          );
          http.open(
              'GET', Postal.prototype.AddressMetadata.BaseUrl
              .concat(parent[key].id+'/'+subKeys[j]),
              true
          );
          http.send();
        }
      }
    }

    for(var i=0;i<countryCodes.length;i++) {
      var http = new XMLHttpRequest();
      http.addEventListener("load", putData.bind(
          null, this.AddressMetadata, countryCodes[i]), false
      );
      http.open(
          'GET', Postal.prototype.AddressMetadata.BaseUrl
          .concat('data/'+countryCodes[i]),
          true
      );
      http.send();
    }
    return this;
  };

  Postal.prototype.printMetadata = function() {
    console.log(JSON.stringify(this.AddressMetadata));
    return this;
  };

  Postal.prototype.saveMetadata = function() {
    var metadata = JSON.stringify(this.AddressMetadata);
    window.location = 'data:application/txt;charset=utf-8,'
        + encodeURIComponent(metadata);
    return this;
  };

  return new Postal();
})();
Postal.AddressComponents = (function() {
  'use strict';

  /** @constructor */
  function AddressComponents() {

  }

  /** @type {!string} */
  AddressComponents.prototype.CountryCode = null;
  /** @type {!string} */
  AddressComponents.prototype.Country = null;
  /** @type {!string} */
  AddressComponents.prototype.City = null;
  /** @type {!string} */
  AddressComponents.prototype.Postcode = null;
  /** @type {!string} */
  AddressComponents.prototype.Route = null;

  return new AddressComponents();

})();