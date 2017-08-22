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
  function Postal(useOnlineData) {
    this.AddressComponents = new Postal.AddressComponents();
    if(typeof useOnlineData !== 'undefined') {
      this.UseOnlineData = useOnlineData;
    }
    if(!this.UseOnlineData) {
      this.AddressMetadata = Postal.AddressMetadata || {};
    }
  }

  /** @type {!boolean} */
  Postal.prototype.UseOnlineData = true;

  /** @type {!string} */
  Postal.prototype.rawAddress = null;

  /** @type {!string} */
  Postal.prototype.tempAddressForDebug = null;

  /** @type {!Object} */
  Postal.prototype.AddressMetadata = {
    BaseUrl: 'https://chromium-i18n.appspot.com/ssl-address/'
  };

  Postal.prototype.parseAddress = function(address, countryCode) {
    this.rawAddress = address;
    if (countryCodes.indexOf(countryCode.toUpperCase()) > -1) {
      // if(this.UseOnlineData) {
      //   var req = new XMLHttpRequest();
      //   req.open("GET", baseAddress.concat(countryCode.toUpperCase()), false);
      //   req.send();
      //   console.dir(req.responseText);
      // }
      var country_meta = Postal.AddressMetadata[countryCode];

      var fmt = 'fmt';
      if(country_meta.hasOwnProperty('lfmt')) {
        fmt = 'lfmt';
      }
      var addr_fmt = country_meta[fmt];
      this.AddressComponents.CountryCode = country_meta.key;
      this.AddressComponents.Country = country_meta.name;

      address = address.toUpperCase()
      .replace(country_meta.name, "");
      address = address.toUpperCase()
      .replace(new RegExp(" "+country_meta.key+"( |$)"), "");

      /* Finding Postcode */
      var zip_candidate = address.match(new RegExp(country_meta.zip, "g"));
      if(zip_candidate !== null) {
        switch(zip_candidate.length) {
          case 0:
            break;
          case 1:
            this.AddressComponents.Postcode = zip_candidate[0];
            address = address.replace(zip_candidate[0].toUpperCase(), "");
            break;
          default:
            if(addr_fmt.startsWith("%Z")) {
              for(var i=0;i<zip_candidate.length;i++) {
                if(address.startsWith(zip_candidate[i].toUpperCase())) {
                  this.AddressComponents.Postcode = zip_candidate[i];
                  address = address.replace(zip_candidate[i].toUpperCase(), "");
                  break;
                }
              }
            } else if(addr_fmt.endsWith("%Z")) {
              for(i=0;i<zip_candidate.length;i++) {
                if(address.endsWith(zip_candidate[i].toUpperCase())) {
                  this.AddressComponents.Postcode = zip_candidate[i];
                  address = address.replace(zip_candidate[i].toUpperCase(), "");
                  break;
                }
              }
            } else {
              var addr_fmt_comp = addr_fmt.match(new RegExp("(.*)(%Z)(.*)"));
              var s = addr_fmt_comp[1].replace(new RegExp("\\S+", "g"), '.*');
              var e = addr_fmt_comp[3].replace(new RegExp("\\S+", "g"), '.*');
              for(i=0;i<zip_candidate.length;i++) {
                if(address.match(new RegExp(s+zip_candidate[i].toUpperCase()+e))) {
                  this.AddressComponents.Postcode = zip_candidate[i];
                  address = address.replace(zip_candidate[i].toUpperCase(), "");
                  break;
                }
              }
            }
        }
      }
      addr_fmt = addr_fmt.replace("%Z", "");

      /* Checking for administrative area */
      addr_fmt_comp = addr_fmt.match(new RegExp("(.*)(%S)(.*)"));
      if(addr_fmt_comp !== null) {
        var sub_names = 'sub_names';
        if(country_meta.hasOwnProperty('sub_lnames')) {
          sub_names = 'sub_lnames';
        }
        var sub_localities = country_meta[sub_names].split("~");
        s = addr_fmt_comp[1].replace(new RegExp("\\S+", "g"), '.*');
        e = addr_fmt_comp[3].replace(new RegExp("\\S+", "g"), '.*');
        for(i=0;i<sub_localities.length;i++) {
          if(address.match(new RegExp(s+sub_localities[i].toUpperCase()+e))) {
            this.AddressComponents.AdminArea = sub_localities[i];
            address = address.replace(sub_localities[i].toUpperCase(), "");
            addr_fmt = addr_fmt.replace("%S", "");
            break;
          }
        }
        if(addr_fmt.match(new RegExp("(.*)(%S)(.*)")) !== null) {
          if(
              address.match(
                  new RegExp(country_meta.state_name_type.toUpperCase())
              )
          ) {
            sub_localities = country_meta.sub_keys.split("~");
            for(i=0;i<sub_localities.length;i++) {
              if(this.AddressComponents.Postcode.match(
                  new RegExp("^"+country_meta[sub_localities[i]].zip, "i")
                  )
              ) {
                console.dir(country_meta[sub_localities[i]]);
                var area_name = 'key';
                if(country_meta[sub_localities[i]].hasOwnProperty('lname')) {
                  area_name = 'lname';
                }
                this.AddressComponents.AdminArea = country_meta[sub_localities[i]][area_name];
                if(country_meta.hasOwnProperty('state_name_type')) {
                  address = address.replace(
                      country_meta.state_name_type.toUpperCase(), "");
                }
                break;
              }
            }
          }
        }
      }
      addr_fmt = addr_fmt.replace("%S", "");
      console.log(addr_fmt);

      /* Checking for locality (mostly city, town or village */
      addr_fmt_comp = addr_fmt.match(new RegExp("(.*)(%C)(.*)"));
      if(addr_fmt_comp !== null) {
        s = addr_fmt_comp[1].replace(new RegExp("\\S+", "g"), '.*');
        e = addr_fmt_comp[3].replace(new RegExp("\\S+", "g"), '.*');
        var addr_comp = address.match(new RegExp(s+"(.*)"+e));
        if(addr_comp !== null) {
          this.AddressComponents.Locality = addr_comp[1];
          address = address.replace(addr_comp[1], "");
        }
      }
      this.tempAddressForDebug = address;
    }
    return this;
  };

  Postal.prototype.validateAddress = function() {
    if(!this.AddressComponents.hasOwnProperty('CountryCode')) {
      this.AddressComponents.valid = false;
    }
    return this;
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

  Postal.prototype.printRawAddress = function() {
    console.log(this.rawAddress);
    return this;
  };

  return Postal;
})();
Postal.AddressComponents = (function() {
  'use strict';

  /** @constructor */
  function AddressComponents() {}

  /** @type {!string} */
  AddressComponents.prototype.CountryCode = null;
  /** @type {!string} */
  AddressComponents.prototype.Country = null;
  /** @type {!string} */
  AddressComponents.prototype.AdminArea = null;
  /** @type {!string} */
  AddressComponents.prototype.Locality = null;
  /** @type {!string} */
  AddressComponents.prototype.Postcode = null;
  /** @type {!string} */
  AddressComponents.prototype.Route = null;

  return AddressComponents;
})();