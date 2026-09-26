// Generado por scripts/generate-api.mjs desde contract/openapi.json. No editar a mano.
export interface paths {
    "/api/v1/colonias": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Colonias de un código postal (catálogo SEPOMEX) */
        get: operations["searchColonias"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
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
    "/api/v1/guardian-invites/{code}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Qué mascota y si la invitación sigue vigente, antes de aceptarla */
        get: operations["getGuardianInvitePreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/guardian-invites/{code}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Aceptar una invitación de guardián */
        post: operations["acceptGuardianInvite"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/internal/crypto/rewrap": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Rotación de llave maestra: reenvuelve un lote de campos cifrados y recalcula índices */
        post: operations["rewrapContacts"];
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
    "/api/v1/me/contact": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Reemplazar teléfonos y contacto de emergencia del perfil (cifrados en reposo) */
        put: operations["updateMyContact"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Mis mascotas */
        get: operations["listPets"];
        put?: never;
        /** Registrar una mascota con fotos */
        post: operations["createPet"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Perfil de una mascota */
        get: operations["getPet"];
        put?: never;
        post?: never;
        /** Dar de baja una mascota (queda inactiva y libera su collar) */
        delete: operations["deletePet"];
        options?: never;
        head?: never;
        /** Editar datos y preferencias de visibilidad (el microchip no se cambia una vez capturado) */
        patch: operations["updatePet"];
        trace?: never;
    };
    "/api/v1/pets/{id}/changes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Historial de cambios del perfil (quién cambió qué y cuándo) */
        get: operations["listPetChanges"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/guardian-invites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Crear enlace de invitación de guardián */
        post: operations["createGuardianInvite"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/guardians": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Guardianes de la mascota */
        get: operations["listGuardians"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/guardians/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Quitar un guardián (el dueño) o dejar de serlo (uno mismo) */
        delete: operations["removeGuardian"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/lost": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activar modo perdido: crea el caso prellenado */
        post: operations["activateLostMode"];
        /** Confirmar regreso: cierra el caso como encontrado */
        delete: operations["confirmPetFound"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/microchip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Corregir el microchip de una mascota (administración, con motivo y bitácora) */
        put: operations["correctMicrochip"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/photos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Agregar fotos */
        post: operations["addPetPhotos"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/photos/{photoId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Quitar una foto */
        delete: operations["removePetPhoto"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/photos/order": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Reordenar fotos; la primera es la portada */
        patch: operations["reorderPetPhotos"];
        trace?: never;
    };
    "/api/v1/pets/{id}/public-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lo que vería quien encuentre a la mascota */
        get: operations["getPetPublicPreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/scans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Historial de escaneos del collar con sus avisos */
        get: operations["listPetScans"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/scans/{scanId}/suspicious": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Marcar un escaneo como sospechoso: el collar pasa a revisión */
        post: operations["markScanSuspicious"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Crear enlace de transferencia de la mascota */
        post: operations["createPetTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pets/{id}/transfers/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancelar la transferencia pendiente de la mascota (el dueño) */
        post: operations["cancelPetTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scans/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Estado de la sesión de escaneo y datos públicos de la mascota */
        get: operations["getScanPreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scans/{token}/finder-report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Avisar al dueño: mensaje, ubicación aproximada, foto y teléfono opcionales */
        post: operations["createFinderReport"];
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
    "/api/v1/scans/qr": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resuelve el código QR del collar y emite un token sin verificar */
        post: operations["resolveQrScan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tags/{id}/mute": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Silenciar el collar por unas horas */
        post: operations["muteTag"];
        /** Quitar el silencio del collar */
        delete: operations["unmuteTag"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tags/{id}/unlink": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Desvincular el collar; vuelve a estar listo */
        post: operations["unlinkTag"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tags/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Vincular el collar recién escaneado a una mascota */
        post: operations["activateTag"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transfers/{code}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Qué mascota y si la transferencia sigue vigente, antes de aceptarla */
        get: operations["getPetTransferPreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/transfers/{code}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Aceptar una transferencia: el receptor pasa a ser dueño */
        post: operations["acceptPetTransfer"];
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
        /** @description Teléfonos y contacto de emergencia del perfil; cifrados en reposo */
        ContactProfile: {
            altPhone: string | null;
            emergencyName: string | null;
            emergencyPhone: string | null;
            phone: string | null;
        };
        /** @description Colonias de un código postal; municipio pausado o CP desconocido se explican */
        CpSearchResult: {
            /** @constant */
            status: "not_found";
        } | {
            estado: string;
            municipio: string;
            /** @constant */
            status: "inactive";
        } | {
            colonias: {
                id: string;
                name: string;
                /** @description Tipo de asentamiento SEPOMEX; se muestra cuando no es «Colonia» */
                type: string | null;
            }[];
            estado: string;
            municipio: string;
            /** @description Cabecera municipal (INEGI): centra el mapa de la zona */
            municipioCenter: {
                lat: number;
                lng: number;
            } | null;
            /** @constant */
            status: "ok";
        };
        /** @description Aviso enviado y canal de contacto disponible */
        FinderReportResult: {
            /** Format: date-time */
            createdAt: string;
            id: string;
            ownerPhone: string | null;
            petId: string;
            /** @enum {string} */
            petStatus: "EN_CASA" | "PERDIDA" | "INACTIVA";
            /** @enum {string} */
            status: "ENVIADO" | "VISTO" | "SOSPECHOSO";
            /** @enum {string} */
            trustLevel: "NFC_VERIFICADO" | "QR_SIN_VERIFICAR";
        };
        GuardianAcceptance: {
            petId: string;
            /** @enum {string} */
            role: "DUENO" | "GUARDIAN";
        };
        GuardianList: {
            items: {
                name: string;
                /** @enum {string} */
                role: "DUENO" | "GUARDIAN";
                /** Format: date-time */
                since: string;
                userId: string;
            }[];
        };
        /** @description Invitación de guardián */
        InviteLink: {
            /** Format: date-time */
            expiresAt: string;
            /** @description Enlace de un solo uso; el código va dentro */
            url: string;
        };
        /** @description Qué mascota y si el enlace sigue vigente, antes de aceptarlo; nada del dueño */
        LinkPreview: {
            petName: string;
            /** @enum {string} */
            state: "valida" | "usada" | "vencida";
        };
        /** @description Estado de la mascota y el caso enlazado tras activar o cerrar el modo perdido */
        LostModeResult: {
            petId: string;
            /** @enum {string} */
            petStatus: "EN_CASA" | "PERDIDA" | "INACTIVA";
            publicationId: string | null;
        };
        /** @description Usuario en sesión, estado de onboarding y preferencias */
        Me: {
            /** @description Falso hasta completar colonia, especies y aviso de privacidad (6b) */
            onboardingComplete: boolean;
            profile: {
                coloniaCp: string | null;
                coloniaId: string;
                coloniaName: string;
                contact: components["schemas"]["ContactProfile"];
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
        MicrochipCorrectionResult: {
            microchipCode: string | null;
            petId: string;
        };
        /** @description Historial de cambios del perfil, del más reciente al más antiguo */
        PetChanges: {
            items: {
                changedBy: {
                    id: string;
                    name: string;
                } | null;
                /** Format: date-time */
                createdAt: string;
                /** @enum {string} */
                field: "NOMBRE" | "ESPECIE" | "SEXO" | "DESCRIPCION" | "FECHA_NACIMIENTO" | "ESTERILIZADO" | "MICROCHIP" | "NOTAS_MEDICAS" | "TELEFONO_VISIBLE" | "NOTAS_VISIBLES" | "FOTOS";
                id: string;
                newValue: string | null;
                previousValue: string | null;
            }[];
            nextCursor: string | null;
        };
        /** @description Perfil completo de una mascota para sus guardianes */
        PetDetail: {
            activeCaseId: string | null;
            /** @description AAAA-MM-DD */
            birthDate: string | null;
            coverPhotoUrl: string | null;
            /** Format: date-time */
            createdAt: string;
            description: string;
            guardians: {
                name: string;
                /** @enum {string} */
                role: "DUENO" | "GUARDIAN";
                /** Format: date-time */
                since: string;
                userId: string;
            }[];
            id: string;
            lostSince: string | null;
            medicalNotes: string | null;
            microchipCode: string | null;
            name: string;
            photos: {
                id: string;
                position: number;
                url: string;
            }[];
            publicCode: string;
            /** @enum {string} */
            role: "DUENO" | "GUARDIAN";
            /** @enum {string} */
            sex: "MACHO" | "HEMBRA" | "DESCONOCIDO";
            showMedicalNotes: boolean;
            showPhoneToFinder: boolean;
            /** @enum {string} */
            species: "PERRO" | "GATO" | "OTRO";
            speciesDetail: string | null;
            /** @enum {string} */
            status: "EN_CASA" | "PERDIDA" | "INACTIVA";
            sterilized: boolean | null;
            tag: {
                activatedAt: string | null;
                id: string;
                mutedUntil: string | null;
                /** @enum {string} */
                status: "FABRICADO" | "LISTO" | "ACTIVO" | "EN_REVISION" | "REVOCADO";
            } | null;
        };
        PetList: {
            items: components["schemas"]["PetSummary"][];
        };
        PetPhotos: {
            photos: {
                id: string;
                position: number;
                url: string;
            }[];
        };
        /** @description Lo que ve quien encuentra a la mascota; nunca datos del dueño */
        PetPublicView: {
            id: string;
            lostSince: string | null;
            medicalNotes: string | null;
            name: string;
            phone: string | null;
            photos: {
                id: string;
                url: string;
            }[];
            /** @enum {string} */
            sex: "MACHO" | "HEMBRA" | "DESCONOCIDO";
            /** @enum {string} */
            species: "PERRO" | "GATO" | "OTRO";
            speciesDetail: string | null;
            /** @enum {string} */
            status: "EN_CASA" | "PERDIDA" | "INACTIVA";
            statusMessage: string;
        };
        /** @description Mascota en la lista de un guardián */
        PetSummary: {
            activeCaseId: string | null;
            coverPhotoUrl: string | null;
            id: string;
            name: string;
            /** @enum {string} */
            role: "DUENO" | "GUARDIAN";
            /** @enum {string} */
            species: "PERRO" | "GATO" | "OTRO";
            speciesDetail: string | null;
            /** @enum {string} */
            status: "EN_CASA" | "PERDIDA" | "INACTIVA";
            tag: {
                activatedAt: string | null;
                id: string;
                mutedUntil: string | null;
                /** @enum {string} */
                status: "FABRICADO" | "LISTO" | "ACTIVO" | "EN_REVISION" | "REVOCADO";
            } | null;
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
        /** @description Configuración que la app consulta al arrancar: versión mínima, proveedores, límites de producto y geografía. */
        RemoteConfig: {
            /** @description Versión mayor del contrato */
            apiVersion: string;
            limits: {
                clientImageMaxDimension: number;
                clientImageQuality: number;
                descriptionMaxLength: number;
                descriptionMinLength: number;
                finderMessageMaxLength: number;
                maxGuardiansPerPet: number;
                maxPetsPerUser: number;
                maxPhotoBytes: number;
                maxPhotos: number;
                maxPublicationsPerDay: number;
                medicalNotesMaxLength: number;
                microchipCodeMaxLength: number;
                minPhotos: number;
                nameMaxLength: number;
                nameMinLength: number;
                phoneLength: number;
                referenceMaxLength: number;
                referenceMinLength: number;
                reportNoteMaxLength: number;
                scanTokenTtlMinutes: number;
                sightingNoteMaxLength: number;
                sightingZoneMaxLength: number;
                sightingZoneMinLength: number;
                speciesDetailMaxLength: number;
                tagMuteDefaultHours: number;
                tagMuteMaxHours: number;
            };
            map: {
                caseZoom: number;
                cityZoom: number;
                coordinateBounds: {
                    maxLat: number;
                    maxLng: number;
                    minLat: number;
                    minLng: number;
                };
                nationalView: {
                    center: {
                        lat: number;
                        lng: number;
                    };
                    zoom: number;
                };
            };
            /** @description Versión mínima de la app (semver). Por debajo, la app exige actualizar. Nulo: sin mínimo. */
            minSupportedAppVersion: string | null;
            /** @description Proveedores de login habilitados, en el orden del diseño */
            oauthProviders: ("google" | "microsoft" | "apple")[];
        };
        /** @description Avance de la rotación de la llave maestra */
        RewrapResult: {
            /** @description Versión de llave maestra vigente */
            currentVersion: number;
            /** @description Campos que aún usan una versión anterior */
            remaining: number;
            /** @description Campos reenvueltos en esta llamada */
            rewrapped: number;
        };
        /** @description Escaneos de una mascota, del más reciente al más antiguo */
        ScanHistory: {
            items: {
                approxLat: number | null;
                approxLng: number | null;
                /** Format: date-time */
                createdAt: string;
                finderReport: {
                    contactPhone: string | null;
                    /** Format: date-time */
                    createdAt: string;
                    id: string;
                    message: string | null;
                    photoUrl: string | null;
                    /** @enum {string} */
                    status: "ENVIADO" | "VISTO" | "SOSPECHOSO";
                } | null;
                id: string;
                /** @enum {string} */
                result: "VALIDO" | "FIRMA_INVALIDA" | "REPLAY" | "TAG_DESCONOCIDO" | "TAG_INACTIVO" | "FORMATO_INVALIDO";
                /** @enum {string} */
                trustLevel: "NFC_VERIFICADO" | "QR_SIN_VERIFICAR";
                view: ("GUARDIAN" | "FINDER" | "ACTIVATION" | "NEUTRAL") | null;
            }[];
            nextCursor: string | null;
        };
        /** @description Estado de la sesión de escaneo y lo público de la mascota */
        ScanPreview: {
            /** Format: date-time */
            expiresAt: string;
            pet: components["schemas"]["PetPublicView"] | null;
            petId: string | null;
            tagStatus: ("FABRICADO" | "LISTO" | "ACTIVO" | "EN_REVISION" | "REVOCADO") | null;
            /** @enum {string} */
            trustLevel: "NFC_VERIFICADO" | "QR_SIN_VERIFICAR";
            /** @enum {string} */
            view: "GUARDIAN" | "FINDER" | "ACTIVATION" | "NEUTRAL";
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
        /** @description Estado del collar y del aviso tras marcar sospecha */
        SuspiciousScanResult: {
            finderReportStatus: ("ENVIADO" | "VISTO" | "SOSPECHOSO") | null;
            scanId: string;
            tagStatus: ("FABRICADO" | "LISTO" | "ACTIVO" | "EN_REVISION" | "REVOCADO") | null;
        };
        /** @description Estado del collar para sus guardianes */
        TagSummary: {
            activatedAt: string | null;
            id: string;
            mutedUntil: string | null;
            petId: string | null;
            /** @enum {string} */
            status: "FABRICADO" | "LISTO" | "ACTIVO" | "EN_REVISION" | "REVOCADO";
        };
        /** @description Transferencia de mascota pendiente */
        TransferLink: {
            /** Format: date-time */
            expiresAt: string;
            transferId: string;
            url: string;
        };
        TransferResult: {
            petId: string;
            /** @enum {string} */
            status: "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "EXPIRADA" | "RESUELTA_ADMIN";
            transferId: string;
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
    searchColonias: {
        parameters: {
            query: {
                cp: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Colonias del CP; municipio pausado o CP desconocido se explican */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CpSearchResult"];
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
    getGuardianInvitePreview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                code: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Vista previa del enlace */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LinkPreview"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    acceptGuardianInvite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                code: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ya eres guardián */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GuardianAcceptance"];
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
            /** @description La invitación no existe o ya se usó (invite.invalid) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Alcanzaste el máximo de guardianes (guardian.limit_reached) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La invitación caducó (invite.expired) */
            410: {
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
    rewrapContacts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Campos a reenvolver en esta llamada
                     * @default 200
                     */
                    batchSize: number;
                };
            };
        };
        responses: {
            /** @description Lote procesado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RewrapResult"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    updateMyContact: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    altPhone?: string | null;
                    emergencyName?: string | null;
                    emergencyPhone?: string | null;
                    phone?: string | null;
                };
            };
        };
        responses: {
            /** @description Contacto guardado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContactProfile"];
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
            /** @description Completa tu perfil primero (profile.incomplete) */
            409: {
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
    listPets: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Mascotas en las que soy guardián */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetList"];
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
    createPet: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    birthDate?: string;
                    description: string;
                    medicalNotes?: string;
                    microchipCode?: string;
                    name: string;
                    /** @description Hasta 4 archivos image/*, 8388608 bytes cada uno */
                    photos?: string[];
                    /**
                     * @default DESCONOCIDO
                     * @enum {string}
                     */
                    sex: "MACHO" | "HEMBRA" | "DESCONOCIDO";
                    /** @default false */
                    showMedicalNotes: boolean;
                    /** @default false */
                    showPhoneToFinder: boolean;
                    /** @enum {string} */
                    species: "PERRO" | "GATO" | "OTRO";
                    speciesDetail?: string;
                    sterilized?: boolean;
                };
            };
        };
        responses: {
            /** @description Mascota creada */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetDetail"];
                };
            };
            /** @description Una foto no es válida (photo.invalid) · Datos inválidos (validation.failed) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
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
            /** @description Alcanzaste el máximo de mascotas (pet.limit_reached) */
            409: {
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
    getPet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Perfil completo */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetDetail"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    deletePet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Mascota inactiva */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetSummary"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La mascota no está en el estado necesario (pet.invalid_state) */
            409: {
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
    updatePet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    birthDate?: string;
                    description?: string;
                    medicalNotes?: string;
                    microchipCode?: string;
                    name?: string;
                    /** @enum {string} */
                    sex?: "MACHO" | "HEMBRA" | "DESCONOCIDO";
                    showMedicalNotes?: boolean;
                    showPhoneToFinder?: boolean;
                    /** @enum {string} */
                    species?: "PERRO" | "GATO" | "OTRO";
                    speciesDetail?: string;
                    sterilized?: boolean;
                };
            };
        };
        responses: {
            /** @description Perfil actualizado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetDetail"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description El microchip ya está registrado y no se puede cambiar (pet.microchip_locked) */
            409: {
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
    listPetChanges: {
        parameters: {
            query: {
                cursor?: string;
                limit: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Página de cambios */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetChanges"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    createGuardianInvite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Enlace de un solo uso */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InviteLink"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Alcanzaste el máximo de guardianes (guardian.limit_reached) */
            409: {
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
    listGuardians: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dueño y guardianes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GuardianList"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    removeGuardian: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Guardianes restantes */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GuardianList"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La mascota no está en el estado necesario (pet.invalid_state) */
            409: {
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
    activateLostMode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    coloniaId: string;
                    /** @default false */
                    hasReward: boolean;
                    lat: number;
                    /** @constant */
                    liabilityAccepted: true;
                    lng: number;
                    locationReference: string;
                    phone: string;
                    /** @constant */
                    safetyNoticeAccepted: true;
                };
            };
        };
        responses: {
            /** @description Mascota en búsqueda y caso creado */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LostModeResult"];
                };
            };
            /** @description Esa colonia no está disponible todavía (colonia.not_selectable) · Datos inválidos (validation.failed) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
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
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La mascota no está en el estado necesario (pet.invalid_state) */
            409: {
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
            /** @description Alcanzaste el límite de publicaciones por día (publication.daily_limit) · Demasiadas peticiones (rate_limited) */
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
    confirmPetFound: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Mascota en casa */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LostModeResult"];
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
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La mascota no está en el estado necesario (pet.invalid_state) */
            409: {
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
    correctMicrochip: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    microchipCode: string | null;
                    reason: string;
                };
            };
        };
        responses: {
            /** @description Microchip corregido */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MicrochipCorrectionResult"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    addPetPhotos: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** @description Hasta 4 archivos image/*, 8388608 bytes cada uno */
                    photos?: string[];
                };
            };
        };
        responses: {
            /** @description Perfil con las fotos nuevas */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetDetail"];
                };
            };
            /** @description Una foto no es válida (photo.invalid) · Demasiadas fotos (photo.limit) · Datos inválidos (validation.failed) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
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
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
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
    removePetPhoto: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                photoId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Perfil sin esa foto */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetDetail"];
                };
            };
            /** @description Demasiadas fotos (photo.limit) · Datos inválidos (validation.failed) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
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
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
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
    reorderPetPhotos: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    photoIds: string[];
                };
            };
        };
        responses: {
            /** @description Perfil con el orden nuevo */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetDetail"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
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
    getPetPublicPreview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Vista pública */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PetPublicView"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    listPetScans: {
        parameters: {
            query: {
                cursor?: string;
                limit: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Página de escaneos */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScanHistory"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    markScanSuspicious: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                scanId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estado resultante */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuspiciousScanResult"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    createPetTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transferencia pendiente */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransferLink"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Ya hay una transferencia pendiente (transfer.pending_exists) */
            409: {
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
    cancelPetTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transferencia cancelada */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransferResult"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La transferencia no existe o ya se resolvió (transfer.invalid) */
            404: {
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
    getScanPreview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Vista y mascota */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScanPreview"];
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
            /** @description Acerca tu teléfono al collar (scan.token_required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La lectura del collar ya no es válida (scan.token_invalid) */
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
    createFinderReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    approxLat?: number;
                    approxLng?: number;
                    /** @default false */
                    locationConsent: boolean;
                    message?: string;
                    phone?: string;
                    /** @description Hasta 1 archivos image/*, 8388608 bytes cada uno */
                    photo?: string[];
                };
            };
        };
        responses: {
            /** @description Aviso enviado */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FinderReportResult"];
                };
            };
            /** @description Una foto no es válida (photo.invalid) · Datos inválidos (validation.failed) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Acerca tu teléfono al collar (scan.token_required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description El dueño silenció este collar por ahora (scan.muted) · La lectura del collar ya no es válida (scan.token_invalid) · Este collar está en revisión (tag.under_review) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Esta lectura no permite avisar (scan.not_reportable) */
            409: {
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
            /** @description Demasiadas peticiones (rate_limited) · Ya avisaste hace poco; espera un momento (scan.cooldown) · Se alcanzó el límite de avisos de hoy (scan.daily_limit) */
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
    resolveQrScan: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Código público de la mascota impreso en el collar */
                    code: string;
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
    muteTag: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Horas de silencio (1 a 168)
                     * @default 4
                     */
                    hours: number;
                };
            };
        };
        responses: {
            /** @description Collar silenciado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TagSummary"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Este collar no está vinculado (tag.not_linked) */
            409: {
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
    unmuteTag: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Collar con avisos */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TagSummary"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Este collar no está vinculado (tag.not_linked) */
            409: {
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
    unlinkTag: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Collar listo */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TagSummary"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Este collar no está vinculado (tag.not_linked) */
            409: {
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
    activateTag: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    petId: string;
                    /** @description Token de escaneo de la lectura que acaba de hacer el dueño */
                    scanToken: string;
                };
            };
        };
        responses: {
            /** @description Collar activo */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TagSummary"];
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
            /** @description Se requiere iniciar sesión (auth.required) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description Cuenta suspendida (auth.suspended) · Solo el dueño puede hacer eso (pet.not_owner) · La lectura del collar ya no es válida (scan.token_invalid) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description No encontrado (not_found) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La mascota no está en el estado necesario (pet.invalid_state) · Este collar no se puede activar (tag.not_activatable) */
            409: {
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
    getPetTransferPreview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                code: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Vista previa del enlace */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LinkPreview"];
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
            /** @description No encontrado (not_found) */
            404: {
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
    acceptPetTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                code: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Transferencia aceptada */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransferResult"];
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
            /** @description La transferencia no existe o ya se resolvió (transfer.invalid) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            /** @description La transferencia caducó (transfer.expired) */
            410: {
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
