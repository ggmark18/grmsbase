#!/bin/sh
diff deploy/templates/default.conf.template deploy/nginx/default.conf.template
diff deploy/templates/app-plugin.module.ts.client client/src/app/app-plugin.module.ts
diff deploy/templates/app-plugin.module.ts.server server/src/app-plugin.module.ts
diff deploy/templates/Docerfile.server server/Dockerfile
diff deploy/templates/Docerfile.client client/Dockerfile
diff deploy/templates/env.deploy deploy/.env
diff deploy/templates/env.server server/.env
diff deploy/templates/npmrc.client client/.npmrc
diff deploy/templates/ormconfig.json server/ormconfig.dev.json
diff deploy/templates/ormconfig.json server/ormconfig.prod.json
diff deploy/templates/proxy.conf.json client/proxy.conf.json

