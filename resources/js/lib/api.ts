/*
 * Retorna o token CSRF gerado pelo Laravel no layout Blade.
 */
const getCsrfToken = () =>
    document
        .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.getAttribute("content") ?? "";

interface ApiErrorData {
    message?: string;
    errors?: Record<string, string[]>;
}

/*
 * Erro utilizado para apresentar mensagens de validação do Laravel.
 */
export class ApiError extends Error {
    status: number;
    errors: Record<string, string[]>;

    constructor(
        message: string,
        status: number,
        errors: Record<string, string[]> = {},
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}

/*
 * Realiza requisições para o Laravel mantendo a sessão e a proteção CSRF.
 */
export async function apiRequest<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const headers = new Headers(options.headers);
    const method = (options.method ?? "GET").toUpperCase();

    headers.set("Accept", "application/json");

    /*
     * FormData define automaticamente seu próprio Content-Type.
     */
    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (method !== "GET" && method !== "HEAD") {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            headers.set("X-CSRF-TOKEN", csrfToken);
        }
    }

    const response = await fetch(url, {
        ...options,
        method,
        headers,
        credentials: "same-origin",
    });

    const responseData = (await response
        .json()
        .catch(() => ({}))) as ApiErrorData;

    if (!response.ok) {
        let errorMessage =
            responseData.message ?? "Não foi possível concluir a operação.";

        /*
         * Traduz erros gerais enviados pelo Laravel.
         */
        if (response.status === 401) {
            errorMessage =
                "Sua sessão expirou. Entre novamente para continuar.";
        }

        if (response.status === 419) {
            errorMessage =
                "A página ficou aberta por muito tempo. Atualize e tente novamente.";
        }

        if (response.status >= 500) {
            errorMessage = "O servidor encontrou um erro. Tente novamente.";
        }

        throw new ApiError(errorMessage, response.status, responseData.errors);
    }

    return responseData as T;
}
