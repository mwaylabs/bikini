/**
 * Created by Thomas on 29.01.2016.
 */

var makeModelsMobileCRM = function () {
  return {
    'uuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0',
    'aclEntries': ['59a51102-1593-4114-8268-45941a0d54c3:rw', 'user.anonymous:r'],
    'effectivePermissions': '*',
    'version': 545,
    'createdUser': '5b1f4be2-df0f-45cb-9990-e2efd5420e1a',
    'createdDate': 1444910504940,
    'modifiedUser': '5b1f4be2-df0f-45cb-9990-e2efd5420e1a',
    'modifiedDate': 1453993039231,
    'application': '1bd93460-725e-11e5-a837-0800200c9a66',
    'name': 'mobilecrm MetaModelContainer',
    'models': {
      'Account': {
        'uuid': '46b00d57-0a13-43f9-a780-20d6ad1c5a86',
        'name': 'Account',
        'label': 'Account',
        'description': 'An account is a customer or company relevant to CRM',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'id',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'ID of account as in CRM system',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'provider',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Origin of the data, can be ews for Exchange, or some other connection name for some SAP system. Leave empty when the record is created in the mobile app.',
          'propertyMap': {}
        }, {
          'name': 'name',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Name of the account',
          'propertyMap': {}
        }, {
          'name': 'primaryAddress',
          'label': '',
          'mandatory': true,
          'description': 'This includes the primary address details, phone, mail, etc.',
          'propertyMap': {
            'complexType': 'Address'
          }
        }, {
          'name': 'secondaryAddresses',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': true,
          'description': 'Billing or shipping addresses when differing from main contact address, mandatory but may be empty. Key of Map is the ID of an account serving as that address. The value is a purpose of address, examples are billing or shipping, use this as translation key in UI.',
          'propertyMap': {}
        }, {
          'name': 'customerSince',
          'label': '',
          'dataType': 'java.util.Date',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'lastVisit',
          'label': '',
          'dataType': 'java.util.Date',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'notes',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Free-text notes and comments',
          'propertyMap': {}
        }, {
          'name': 'lifecycle',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Rolle des Accounts (POINT, Interessent, Kunde..)',
          'propertyMap': {}
        }, {
          'name': 'status',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'segment',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'currency',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'office',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Where the responsible sales representative is located',
          'propertyMap': {}
        }, {
          'name': 'group',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Sales group of the account',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'Address': {
        'uuid': 'af433a4d-372f-44d2-8ae6-69cb38e1dbd5',
        'name': 'Address',
        'label': 'Address',
        'description': 'common address fields',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'salutation',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Examples are Mr., Mrs., Ms.',
          'propertyMap': {}
        }, {
          'name': 'title',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Examples are M.Sc., Dr., etc.',
          'propertyMap': {}
        }, {
          'name': 'firstName',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'lastName',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'postCode',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'city',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'street',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'house',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'country',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'phone',
          'label': '',
          'mandatory': false,
          'description': '',
          'propertyMap': {
            'complexType': 'PhoneNumber'
          }
        }, {
          'name': 'mobile',
          'label': '',
          'mandatory': false,
          'description': '',
          'propertyMap': {
            'complexType': 'PhoneNumber'
          }
        }, {
          'name': 'fax',
          'label': '',
          'mandatory': false,
          'description': '',
          'propertyMap': {
            'complexType': 'PhoneNumber'
          }
        }, {
          'name': 'email',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'language',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'What language to talk to this contact partner in letters, mail or by phone, etc.',
          'propertyMap': {}
        }, {
          'name': 'latitude',
          'label': '',
          'dataType': 'java.math.BigDecimal',
          'mandatory': false,
          'description': 'Part of geolocation of the address provided, if any',
          'propertyMap': {}
        }, {
          'name': 'longitude',
          'label': '',
          'dataType': 'java.math.BigDecimal',
          'mandatory': false,
          'description': 'Part of geolocation of the address provided, if any',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'Appointment': {
        'uuid': '37e433fa-429d-4684-b7ed-fc48e7ab8063',
        'name': 'Appointment',
        'label': 'Appointment',
        'description': 'An appointment is an entry in the calendar',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'id',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'ID of appointment as in source system',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'provider',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Origin of the data, can be ews for Exchange, or some other connection name for some other SAP system. Leave empty when the record is created in the mobile app.',
          'propertyMap': {}
        }, {
          'name': 'title',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Title of the appointment',
          'propertyMap': {}
        }, {
          'name': 'startsAt',
          'label': '',
          'dataType': 'java.util.Date',
          'mandatory': true,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'endsAt',
          'label': '',
          'dataType': 'java.util.Date',
          'mandatory': true,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'state',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Appointment.state: ZCRMACT4-$STATUS',
          'propertyMap': {}
        }, {
          'name': 'reason',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Appointment.reason: $KATALOGART-$CODEGRUPPE-$CODE-$STATUS',
          'propertyMap': {}
        }, {
          'name': 'visitType',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Appointment.visitType',
          'propertyMap': {}
        }, {
          'name': 'protocol',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'Notiz für die Termine, darf nicht leer sein',
          'propertyMap': {}
        }, {
          'name': 'account',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'id of an associated Account, may be empty.',
          'propertyMap': {}
        }, {
          'name': 'contacts',
          'label': '',
          'dataType': '[Ljava.lang.String;',
          'mandatory': false,
          'description': 'ids of Contact, mandatory but may be empty.',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'Contact': {
        'uuid': '28d7bd68-4efa-486d-89fc-5012ee39a059',
        'name': 'Contact',
        'label': 'Contact',
        'description': 'specific address fields for business partners, etc.',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'id',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'ID of partner as in CRM system, informal only',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'provider',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Origin of the data, can be ews for Exchange, or some other connection name for some other SAP system. Leave empty when the record is created in the mobile app.',
          'propertyMap': {}
        }, {
          'name': 'partnerfunction',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'role/function of Partner, relevant on creation',
          'propertyMap': {}
        }, {
          'name': 'address',
          'label': '',
          'mandatory': false,
          'description': '',
          'propertyMap': {
            'complexType': 'Address'
          }
        }, {
          'name': 'accounts',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'dictionary keyed on id of associated Accounts, mandatory but may be empty if the contact originates from Exchange, for example. The values are roles of the contact for the specific account, examples are sales or research and development, use this as translation key in UI.',
          'propertyMap': {}
        }, {
          'name': 'accountsDefaultContact',
          'label': '',
          'dataType': '[Ljava.lang.String;',
          'mandatory': false,
          'description': 'subset of ids of accounts for which this contact serves as default contact, mandatory but may be empty',
          'propertyMap': {}
        }, {
          'name': 'admin',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'dictionary keyed on id of associated Account in which the contact person serves as an admin using the email address provided as value.',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'Dashboard': {
        'uuid': '5fbad7bf-c105-4737-99e6-d245216d219f',
        'name': 'Dashboard',
        'label': 'Dashboard',
        'description': 'Contains information relevant for dashboard display as well as statistics about the synchronization process, etc. The client may alter the data but any write attempts are silently ignored and the server information is reported back. When synchronizing the information is constantly updated by the backend, and periodically saved so that the dashboard statistics may update in real-time.',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'id',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'User UUID the record belongs to',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'aclEntries',
          'label': '',
          'dataType': '[Ljava.lang.String;',
          'mandatory': true,
          'description': 'Determines who may see and modify this record, just device user can see it, any authenticated user can alter it as user may change',
          'propertyMap': {}
        }, {
          'name': 'lastSync',
          'label': '',
          'dataType': 'java.util.Date',
          'mandatory': false,
          'description': 'Timestamp of last successful synchronization',
          'propertyMap': {}
        }, {
          'name': 'ewsUsername',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Username of EWS Exchange server connection, stored by backend only. When change of user is detected, all information is dropped.',
          'propertyMap': {}
        }, {
          'name': 'clientAccounts',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'Maps client IDs to account IDs of SAP',
          'propertyMap': {}
        }, {
          'name': 'clientContacts',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'Maps client IDs to contact IDs of SAP',
          'propertyMap': {}
        }, {
          'name': 'clientAppointments',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'Maps client IDs to appointment IDs of SAP',
          'propertyMap': {}
        }, {
          'name': 'clientTasks',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'Maps client IDs to task IDs of SAP',
          'propertyMap': {}
        }, {
          'name': 'badges',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'Map keyed on menu section (Tasks, for example) containing badge count information, as Maps support String values only this is a String although it should be Integers.',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'Enumeration': {
        'uuid': '997d23f7-d9f6-494a-bb23-ae253e74ccd4',
        'name': 'Enumeration',
        'label': 'Enumeration',
        'description': 'Enumeration codes to human-readable display texts.',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'id',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'Constructed as concatenation of name-language-format for easy retrieval.',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'provider',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Origin of the data, can be ews for Exchange, or some other connection name for some other SAP system. Leave empty when the record is created in the mobile app.',
          'propertyMap': {}
        }, {
          'name': 'name',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'Constant denoting which enumeration the record is for. By convention we use Model.attribute as name, Account.lifecycle or Address.salutation for example.',
          'propertyMap': {}
        }, {
          'name': 'language',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'Language the enumeration is made for, de for example.',
          'propertyMap': {}
        }, {
          'name': 'format',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'enumDefinition': {
            'items': [{
              'label': 'default',
              'value': 'default'
            }, {
              'label': 'long',
              'value': 'long'
            }],
            'strict': true
          },
          'description': 'Whether this is shorttext (default) or longtext, when there are no different texts this is set to default.',
          'propertyMap': {}
        }, {
          'name': 'values',
          'label': '',
          'dataType': 'java.util.Map',
          'mandatory': false,
          'description': 'Dictionary of enumeration by key and value, "24": "Fuhrparkleiter/in", for example.',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'GeocodeCacheEntry': {
        'uuid': '5362ce17-5085-4538-9c3a-47d68413855a',
        'name': 'GeocodeCacheEntry',
        'label': 'GeocodeCacheEntry',
        'description': 'Longitude/Latitude by Address, not meant for client use!',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'address',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'Address-query the location belongs to',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'provider',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Origin of the data, can be googleGeocoding or osmGeocoding.',
          'propertyMap': {}
        }, {
          'name': 'timestamp',
          'label': '',
          'dataType': 'java.util.Date',
          'mandatory': false,
          'description': 'Timestamp of data retrieval',
          'propertyMap': {}
        }, {
          'name': 'latitude',
          'label': '',
          'dataType': 'java.math.BigDecimal',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'longitude',
          'label': '',
          'dataType': 'java.math.BigDecimal',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'PhoneNumber': {
        'uuid': 'ce8877d4-b0d9-4cce-8b5c-77fbc457692b',
        'name': 'PhoneNumber',
        'label': 'PhoneNumber',
        'description': 'common phone number fields, see also http://www.howtocallabroad.com/codes.html',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'country',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Examples are DE, US, etc.',
          'propertyMap': {}
        }, {
          'name': 'number',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'An examples is 0711 25254',
          'propertyMap': {}
        }, {
          'name': 'extension',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'An example is 650',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'SalesOffice': {
        'uuid': '19a7ca3d-f177-49fa-ac33-351202ec21b9',
        'name': 'SalesOffice',
        'label': 'SalesOffice',
        'description': 'Sales office information',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'id',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'ID of sales office as in CRM system: SALES_OFFICE, key of SalesOffice enumeration',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'provider',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Origin of the data, or some other connection name for some other SAP system.',
          'propertyMap': {}
        }, {
          'name': 'groups',
          'label': '',
          'dataType': '[Ljava.lang.String;',
          'mandatory': true,
          'description': 'IDs of SalesGroups in SalesOffice, key of SalesOffice enumeration',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      },
      'Task': {
        'uuid': '493abcff-1180-49dc-8cb2-e2aeaf79a6ea',
        'name': 'Task',
        'label': 'Task',
        'description': 'A task is an entry in the calendar',
        'parents': [],
        'fieldDefinitions': [{
          'name': 'id',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': true,
          'description': 'ID of task as in source system',
          'keyField': true,
          'propertyMap': {}
        }, {
          'name': 'provider',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Origin of the data, can be ews for Exchange, or some other connection name for some other SAP system. Leave empty when the record is created in the mobile app.',
          'propertyMap': {}
        }, {
          'name': 'title',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Title of the appointment',
          'propertyMap': {}
        }, {
          'name': 'dueTo',
          'label': '',
          'dataType': 'java.util.Date',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'description',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': '',
          'propertyMap': {}
        }, {
          'name': 'state',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'Whether a task is overdue must be computed, i.e. it is overdue when state is open and dueTo is in the past',
          'propertyMap': {}
        }, {
          'name': 'account',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'id of associated Account',
          'propertyMap': {}
        }, {
          'name': 'contact',
          'label': '',
          'dataType': 'java.lang.String',
          'mandatory': false,
          'description': 'id of Contact supervising the task, optional.',
          'propertyMap': {}
        }],
        'propertyMap': {},
        'version': -1,
        'abstract': false,
        'containerUuid': '8CD3E18C-5D19-445A-9916-9908BF240FB0'
      }
    }
  };
}
