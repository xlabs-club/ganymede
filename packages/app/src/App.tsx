import { Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';
import { ToolboxPage } from '@drodil/backstage-plugin-toolbox';

import {
  AlertDisplay,
  OAuthRequestDialog,
  ProxiedSignInPage,
  SignInPage,
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { RbacPage } from '@backstage-community/plugin-rbac';
import { PlaylistIndexPage, PlaylistPage } from '@backstage-community/plugin-playlist';
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import * as plugins from './plugins';
import { ExplorePage } from '@backstage-community/plugin-explore';
import customColumnsFunc from './components/catalog/custom-columns';
import { EntityKindPicker, EntityTypePicker, UserListPicker, EntityOwnerPicker } from '@backstage/plugin-catalog-react';
const app = createApp({
  apis,
  plugins: Object.values(plugins),
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  components: {
    // SignInPage: props => <SignInPage {...props} auto providers={['guest']} />,
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      // 开发环境使用guest账号，生产环境使用oauth2Proxy作为登录认证
      if (configApi.getString('auth.environment') === 'development') {
        return (
          <SignInPage
            {...props}
            providers={['guest']}
          />
        );
      }
      return <ProxiedSignInPage {...props} provider="oauth2Proxy" />;
    },
  },
});

const routes = (
  <FlatRoutes>
    {/* <Route path="/" element={<Navigate to="catalog" />} /> */}
    <Route path="/" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>;
    <Route path="/catalog"
      element={<CatalogIndexPage
        columns={customColumnsFunc}
        filters={
          <>
            <EntityKindPicker />
            <EntityTypePicker />
            <UserListPicker />
            <EntityOwnerPicker />
          </>
        }
      />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/playlist" element={<PlaylistIndexPage />} />
    <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/toolbox" element={<ToolboxPage />} />
    <Route path="/rbac" element={<RbacPage />} />;
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
