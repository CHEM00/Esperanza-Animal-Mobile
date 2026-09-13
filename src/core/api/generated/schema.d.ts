// Generado por scripts/generate-api.mjs desde contract/openapi.json. No editar a mano.
export interface paths {
    "/api/v1/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Configuración remota para la app móvil */
        get: operations["getRemoteConfig"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Usuario en sesión y estado de su cuenta */
        get: operations["getMe"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scans/nfc": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verifica una lectura NFC y resuelve qué vista mostrar */
        post: operations["resolveNfcScan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Usuario en sesión, estado de onboarding y preferencias */
        Me: {
            /** @description Falso hasta completar colonia, especies y aviso de privacidad (6b) */
            onboardingComplete: boolean;
            profile: {
                coloniaCp: string | null;
                coloniaId: string;
                coloniaName: string;
                notifyColonia: boolean;
                species: ("PERRO" | "GATO" | "OTRO")[];
            } | null;
            user: {
                email: string;
                id: string;
                image: string | null;
                name: string;
                role: string | null;
            };
        };
        /** @description Error en formato Problem Details (RFC 9457) */
        Problem: {
            /** @description Código estable para traducir en la app */
            code: string;
            detail?: string;
            /** @description Errores por campo cuando el código es validation.failed */
            errors?: {
                message: string;
                path: string;
            }[];
            requestId: string;
            status: number;
            title: string;
            /** @description URN estable del tipo de problema */
            type: string;
        };
        /** @description Configuración que la app consulta al arrancar: versión mínima, proveedores, municipios y límites de producto. */
        RemoteConfig: {
            activeMunicipios: {
                estado: string;
                id: string;
                name: string;
            }[];
            /** @description Versión mayor del contrato */
            apiVersion: string;
            limits: {
                clientImageMaxDimension: number;
                clientImageQuality: number;
                descriptionMaxLength: number;
                descriptionMinLength: number;
                maxPhotoBytes: number;
                maxPhotos: number;
                maxPublicationsPerDay: number;
                minPhotos: number;
                nameMaxLength: number;
                phoneLength: number;
                referenceMaxLength: number;
                referenceMinLength: number;
                reportNoteMaxLength: number;
                sightingNoteMaxLength: number;
                sightingZoneMaxLength: number;
                sightingZoneMinLength: number;
                speciesDetailMaxLength: number;
            };
            map: {
                caseZoom: number;
                cityCenter: {
                    lat: number;
                    lng: number;
                };
                cityZoom: number;
                coordinateBounds: {
                    maxLat: number;
                    maxLng: number;
                    minLat: number;
                    minLng: number;
                };
            };
            /** @description Versión mínima de la app (semver). Por debajo, la app exige actualizar. Nulo: sin mínimo. */
            minSupportedAppVersion: string | null;
            /** @description Proveedores de login habilitados, en el orden del diseño */
            oauthProviders: ("google" | "microsoft" | "apple")[];
        };
        /** @description Resultado de acercar el teléfono a un collar: qué vista mostrar y el token de escaneo si aplica. */
        ScanResolution: {
            expiresAt: string | null;
            /** @description Prueba de presencia física para las acciones de la vista */
            scanToken: string | null;
            /** @description Solo cuando la vista no es neutra */
            tagStatus: ("FABRICADO" | "LISTO" | "ACTIVO" | "EN_REVISION" | "REVOCADO") | null;
            /**
             * @description Vista que debe mostrar el cliente
             * @enum {string}
             */
            view: "GUARDIAN" | "FINDER" | "ACTIVATION" | "NEUTRAL";
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getRemoteConfig: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Configuración vigente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RemoteConfig"];
                };
            };
            /** @description Demasiadas peticiones (rate_limited) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Error interno (internal_error) */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
        };
    };
    getMe: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usuario, onboarding y preferencias */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Me"];
                };
            };
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Demasiadas peticiones (rate_limited) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Error interno (internal_error) */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
        };
    };
    resolveNfcScan: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description CMAC de la lectura, 16 hexadecimales */
                    m: string;
                    /** @description PICCData cifrado (UID y contador), 32 hexadecimales */
                    p: string;
                };
            };
        };
        responses: {
            /** @description Vista resuelta y token de escaneo si aplica */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScanResolution"];
                };
            };
            /** @description Datos inválidos (validation.failed) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Tipo de contenido no soportado (unsupported_media_type) */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Demasiadas peticiones (rate_limited) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Error interno (internal_error) */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
        };
    };
}
