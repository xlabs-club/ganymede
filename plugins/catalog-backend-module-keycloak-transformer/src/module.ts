import {
  createBackendModule,
} from '@backstage/backend-plugin-api';

import {
  GroupTransformer,
  keycloakTransformerExtensionPoint,
  UserTransformer,
} from '@backstage-community/plugin-catalog-backend-module-keycloak';


const customGroupTransformer: GroupTransformer = async (
  entity,
  group,
  _realm,
) => {
  // metadata.name不允许中文，替换成id
  entity.metadata.name = group.id ?? ''
  entity.metadata.title = group.name ?? ''
  entity.spec.profile = {
    ...entity.spec.profile,
    displayName: group.name ?? ''
  };
  return entity;
};

const customUserTransformer: UserTransformer = async (
  entity,
  user,
  _realm,
  _groups,
) => {

  // the attributes value is an array of strings, so we need to join them
  entity.spec.profile = {
    ...entity.spec.profile,
    displayName: (user.attributes?.displayName ?? [user.lastName, user.firstName])
      .filter(Boolean).join(''),
  };
  entity.metadata.annotations = {
    ...entity.metadata.annotations,
    'xlabs.club/user-phone': `${String(user.attributes?.phoneNumber?.filter(Boolean).join('') ?? '')}`,
  };
  return entity;
};

export const keycloakBackendModuleTransformer = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'keycloak-transformer',
  register(reg) {
    reg.registerInit({
      deps: { keycloak: keycloakTransformerExtensionPoint },
      async init({ keycloak }) {
        keycloak.setUserTransformer(customUserTransformer);
        keycloak.setGroupTransformer(customGroupTransformer);
      },
    });
  },
});
