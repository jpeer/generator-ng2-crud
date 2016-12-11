# generator-ng2-crud

Yeoman generator for scaffolding fullstack data entry web apps. 

## Overview

ng2-crud is a generator for scaffoling CRUD (Create/Read/Update/Delete) user interfaces. It takes a JSON config file as input and based on the data model information from the file will generate:
  1. a REST server based on express and mongoose supporting CRUD operations on the defined entities, using a Mongodb database for storage
  2. an Angular2 frontend, supporting data entry and navigation. In particular, for each entity, a "list" view and an "edit" view are generated.

After the application is generated, the developer can customize the details. The generated code is kept simple on purpose, to be easily editable. 

ng2-crud is comprised of two sub-generators, `ng2-crud:client` and `ng2-crud:server`, which can be invoked independently of each other, but the most likely use case is invoking both in one go, by using `ng2-crud`. 

Each of the sub generators create their own node projects, with their own `packages.json` files and build processes. By default the client project is embedded in the server project, and the server side's express app serves both the REST pages and the angular2 frontend, so that no Cross-origin resource sharing (CORS) scheme needs to be employed. 


### Advanced features
 
Beyond basic CRUD features, the following is supported: 

* arbitrarily nested sub-documents (resulting in nested form groups)
* arrays (resulting in dynamic forms)
* one-to-many relations between entities (resulting in combobox selections being shown)
 
 
## Prerequisites

* npm/node installed
* mongodb running
* unix shell available


## Installation

First, install [Yeoman](http://yeoman.io) and generator-ng2-crud using [npm](https://www.npmjs.com/)

```bash
npm install -g yo
npm install -g generator-ng2-crud
```

## Usage

One option is to use the provided convenience script:
```
./quickrun.sh <app-dir>
```
The script aims to reduce waiting time during repeated code-regeneration by caching node_module contents. Also, it starts the express server automatically after the code generation.

The second option is to invoke yeoman explicitly:  

```
mkdir <app-dir>
cd <app-dir>
yo ng2-crud

# and then:
npm start
```

In both cases, the yeoman generator will ask for the location of the project configuration file. For starters, you can take the demo project config file included in the `ng2-crud` source code.
 
The rest of this docu will describe the structure of such a config file. 


## Configuration

ng2-crud asks for a configuration file as the input, default name *project-config.json*.


the json document contains the following main sections:
* *title*, *projectName*: describes project name and title of used for landing page, title bar and 
* *entities*: the data structures to be supported by the CRUD app
* *pagination* (optional): allows to define pagination settigs to (groups of) entities
* *validators* (optional): allows to define validation settigs to (groups of) entity properties
* *serverConfig* (optional): describes properties of the backend server. 

## Definition of Entities

Definition of entities, properties of entities and relations between entities is the central information for the generator.

### Example

Here an example of two entities that demonstrate several aspects of defining data models for ng2-crud:

~~~~
    "customer": {
      "name": "string",
      "title?": "string",
      "birthday?" : "date",
      "addresses": [{
        "street": "string",
        "zip": "string",
        "city": "string",
        "country": "ref:country:name"
      }]
    },
    
    "country": {
      "continent": "number"
    }    
~~~~

Note that there is no "_id" field specified. It will be auto-generated for every entity and the application assumes that each entity has an `_id` field. 

### Property types

Fields (properties) are defined by name/type pairs in json, e.g. customer's `name` is specified to be of type `string`.

The list of admissable types is:

* `string`
* `text` (like string, but will lead to a text area being generated for input instead of plain text input fields)
* `number`
* `date` (will generate date pickers)
* `boolean` (will generate checkboxes)

Also supported are:

* *arrays*: supported are arrays of primitives, of subdocuments and of references. The generated entry forms will provide buttons for adding/remving elements of those arrays. In the example above, the customer's addresses field is an array of subdocuments, as defined by the json array syntax [square brackets]. 
* *sub-documents*: for example the elements of the `addresses`-array above are subdocuments. Any arbitrary depth of nested objects is supported. The resulting input forms will be structured accordingly. 
* *references*: References point to other entities in the model.  For example, the definition `"country": "ref:country:name"` above means that the field "country" in the customer's address is a reference to the entity "country". The text after the second column specifies which fields in the target collection (country) should be used for visual representation.  


Note that optional fields can be marked with a trailing question mark (e.g. `"title?" : "string`) . This will per default skip the "required" validator, which is (per default) applied to all non-optional properties.


### Fine-tuning the model

#### Validators

information about client side validators (form validation) can be placed directly inside the entity model, or can be placed into a dedicated top-level section "validators" 

Here how to embed this directly into the entity description:

~~~~
    "country": {
      "name": {
         "type" : "string",
         "validators" : [ "required", "minLength(2)", "maxLength(30)" ]
      }
    } 
~~~~ 

However, in order to keep the entity definitions concise, it is possible to map validators to properties as follows: 
  
~~~~  
  "validators": {
    ".*" : [ "required" ]
    "customer.title": [],
    "customer.addresses.street": [ "required", "minLength(3)". "maxLength(50)"],        
  }
~~~~  

For each of mappings, the key (e.g. "customer.title") is used as a regular expression to match one or more properties of the describe datamodel (cf. `entities` section), and the value (e.g. "[]") is then applied to all matching properties. 

Since the values are applied in the order of definition, it is possible to specify some generic expressions (e.g. "`.*`") at the start, and then define overrides for more specific places afterwards.


### Pagination

The `pagination` section of the config allows to define the settings for the client-side pagination. The options are 
    * `enabled`: true if a pagination bar should be shown
    * `tableSize`: the number of items shown per page.

~~~~
  "pagination": {
    ".*": {
      "enabled": true,
      "tableSize": 20
    },
    "country": {
      "enabled": false
    }
  },
~~~~

This works as described for validators above: whatever entity matches the provided regex key (e.g. `.*`) gets assigned the provided value (pagination settings). Since the map is walked sequencially, it is possible to start with generic defaults and then provide overrides for a selected subset of entities.  


## Full Example

Below we see the example for an imaginary order entry system for a small company: we have `customers` from certain `countries` who issue `orders` containing various items involing the company's `products`.


*project-config.json:*
```
{
  "title" : "Demo App",

  "entities": {

    "customer": {
      "name": "string",
      "title?": "string",
      "address": {
        "street": "string",
        "zip": "string",
        "city": "string",
        "country": "ref:country:name"
      }
    },

    "product": {
      "catNr": "string",
      "title": "string",
      "description?": "string"
    },

    "order": {
      "date": "date",
      "customer": "ref:customer:name",
      "comment": {
        "type": "text",
        "validators": [
          "required",
          "maxLength(200)"
        ]
      },
      "items": [
        {
          "qty": "number",
          "prod": "ref:product:title",
          "price": "number"
        }
      ]
    },

    "country": {
      "name": "string"
    }
  },

  "pagination": {
    ".*": {
      "enabled": true,
      "tableSize": 20
    },
    "country": {
      "enabled": false
    }
  },

  "validators": {
    "product.*": [ "required", "maxLength(30)"]
  },

  "serverConfig": {
    "expressPort": 3000,
    "mongoDbUrl": "mongodb://localhost/demo"
  }
}
```

if we run `yo ng2-crud` against this configuration (.e.g by invoking `./quickrun.sh <app-dir>`), we should get a data entry screen such as the following:
 
![Screenshot](http://imgur.com/a/x7ifQ)


## Known Limitations and TODOs 

The current system is working but many features are not yet developed or perhaps not production grade quality. Here the known limitations and todods: 

* No server side validation
* No server side paginiation support (crucial for large datasets that can not be dowloaded to client)
* No possibility yet to specify indexes on database model
* Support for one-to-many relationships can be improved:
  * offer searchbar or similar for too large datasets where combobox is not feasible
  * to of
* No support for data buffers (e.g. image uploads)
* Date picker not working (waiting for ng2-bootstrap's datepicker implementing ValueAccessor interface)
* the frontend boilerplate (package json, tsconfig) come from angular2 seed project (one time snapshot). It would be better to refer to a yeoman generator instead to stay up to date w/ libraries etc. 


## License

Apache-2.0 © [jpeer](joachim.peer at gmail)
