import { TableColumn, OverflowTooltip } from "@backstage/core-components";
import { CatalogTableRow, CatalogTableColumnsFunc, CatalogTable } from "@backstage/plugin-catalog";
import React from "react";

const createUserEmailColumn = (): TableColumn<CatalogTableRow> => ({
    title: '邮箱',
    field: 'entity.spec.profile.email',
    render: ({ entity }) => {
        return (
            <OverflowTooltip
                text={(entity.spec?.profile as { email?: string })?.email || ''}
                placement="bottom-start"
            />
        );
    },
});

const createUserPhoneColumn = (): TableColumn<CatalogTableRow> => ({
    title: '手机号',
    field: 'entity.metadata.annotations["fxiaoke.com/user-phone"]',
    render: ({ entity }) => (
        <OverflowTooltip
            text={entity.metadata?.annotations?.['fxiaoke.com/user-phone'] || ''}
            placement="bottom-start"
        />
    ),
});

const customColumnsFunc: CatalogTableColumnsFunc = entityListContext => {
    if (entityListContext.filters.kind?.value === 'user') {
        return [
            // Render existing columns
            // ...CatalogTable.defaultColumnsFunc(entityListContext),
            CatalogTable.columns.createNameColumn(),
            // Add new columns here
            createUserEmailColumn(),
            createUserPhoneColumn(),
            // CatalogTable.columns.createMetadataDescriptionColumn(),
        ];
    }

    return CatalogTable.defaultColumnsFunc(entityListContext);
};

export default customColumnsFunc;