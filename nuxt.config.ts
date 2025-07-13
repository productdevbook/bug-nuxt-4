import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'pathe';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    (options, nuxt)=> {
      nuxt.hooks.hook('prepare:types', (options) => {
      options.references.push({ path: 'types/nitro-graphql-client.d.ts' })

      options.tsConfig ??= {}
      options.tsConfig.compilerOptions ??= {}
      options.tsConfig.compilerOptions.paths ??= {}
      options.tsConfig.compilerOptions.paths['#graphql/client'] = [
        './types/nitro-graphql-client.d.ts',
      ]
      options.tsConfig.include = options.tsConfig.include || []
      options.tsConfig.include.push('./types/nitro-graphql-client.d.ts')
    })

    // Add Vite/webpack alias for runtime resolution
    nuxt.options.alias = nuxt.options.alias || {}
    nuxt.options.alias['#graphql/client'] = join(nuxt.options.buildDir, 'types/nitro-graphql-client.d.ts')

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(nuxt.options.srcDir, 'graphql'))
    })
    }
  ],
  nitro: {
    modules: [
      (nitro) => {
        const clientTypesPath = resolve(
          nitro.options.buildDir,
          'types',
          'nitro-graphql-client.d.ts'
        );
        const sdkTypesPath = resolve(nitro.options.rootDir, 'app', 'graphql', 'sdk.ts');

        mkdirSync(dirname(clientTypesPath), { recursive: true });
        mkdirSync(dirname(sdkTypesPath), { recursive: true });

        writeFileSync(clientTypesPath, 'export type test = string', 'utf-8');
        writeFileSync(sdkTypesPath, 'import * as Types from "#graphql/client";\nexport const test: Types.test = "asd";' , 'utf-8');
      },
    ],
  },
});
