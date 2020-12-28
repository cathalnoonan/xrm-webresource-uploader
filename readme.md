# XRM WebResource Uploader

Function to deploy web resources to the specified solution in Dynamics 365 / Power Platform from node js


## Example

```js
const path = require('path');
const { uploadWebResources, XrmClientSecretAuthService } = require('@cathalnoonan/xrm-webresource-uploader');

(async function () {

    await uploadWebResources({
        apiVersion: 'v9.1',
        deployFolder: path.resolve(__dirname, 'dist'),
        authService: new XrmClientSecretAuthService({
            clientId: '<your client id>',
            clientSecret: '<your client secret>',
            tenantId: '<your tenant id>',
            environmentUrl: 'https://your-environment.crm4.dynamics.com',
            tokenTolerance: 60
        }),
        soltionName: '<your soultion unique name>',
        includeSourceMaps: true,
    })
}()) 
```