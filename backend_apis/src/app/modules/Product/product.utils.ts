/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetch } from 'undici';
import config from '../../config';

export interface ApifyRunResult<T = unknown> {
    items: T[];
    actorId: string;
    runId: string;
}

function getApifyToken(): string {
    return String(config.apify_api_key);
}

function withToken(url: string): string {
    const token = getApifyToken();
    if (!token) return url;
    return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
}

async function startActorRun(actorId: string) {
    console.log('3');
    const maxItems = Number(config.apify_run_max_items);
    const maxItemsQuery = Number.isFinite(maxItems) && maxItems > 0 ? `&maxItems=${maxItems}` : '';
    const url = withToken(
        `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/runs?waitForFinish=60${maxItemsQuery}`,
    );

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: undefined,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Apify run start failed (${res.status}): ${text}`);
    }

    const result = await res.json();
    console.log('4');
    console.log({ result });

    return result;
}

async function waitForRunToFinish(
    runId: string,
    waitForFinishSeconds: number,
): Promise<Record<string, unknown>> {
    console.log('5');
    if (!runId) {
        throw new Error('Apify wait for run failed: missing runId');
    }

    const wait = Math.max(0, Math.min(999, Math.floor(waitForFinishSeconds || 0)));
    const url = withToken(
        `https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}?waitForFinish=${wait}`,
    );

    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Apify wait for run failed (${res.status}): ${text}`);
    }
    return (await res.json()) as unknown as Record<string, unknown>;
}

async function getDatasetItems<T = unknown>(datasetId: string): Promise<T[]> {
    console.log('6');
    if (!datasetId) {
        throw new Error('Apify get dataset failed: missing datasetId');
    }

    const url = withToken(
        `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true&format=json`,
    );
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Apify get dataset failed (${res.status}): ${text}`);
    }
    return (await res.json()) as unknown as T[];
}

export async function runActorAndGetItems<T = unknown>(
    actorId: string,
    timeoutMs = 15 * 60 * 1000,
): Promise<ApifyRunResult<T>> {
    console.log('2');
    const runStart = await startActorRun(actorId);

    console.log({ runStart });

    const runStartData: any = (runStart as any).data || runStart;
    const runId: string = runStartData?.id;
    const startedAt = Date.now();

    while (true) {
        const elapsedMs = Date.now() - startedAt;
        const remainingMs = timeoutMs - elapsedMs;
        if (remainingMs <= 0) {
            const seconds = Math.floor(timeoutMs / 1000);
            throw new Error(`Apify run ${runId} timeout after ${seconds}s`);
        }

        // No artificial waiting: let Apify hold the request until something changes.
        // Keep each wait call bounded.
        const waitForFinishSeconds = Math.max(1, Math.min(60, Math.floor(remainingMs / 1000)));

        const run = await waitForRunToFinish(runId, waitForFinishSeconds);
        const runData: any = (run as any).data || run;
        const status = runData?.status;
        console.log({ status });
        if (status === 'SUCCEEDED' || status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
            if (status !== 'SUCCEEDED') {
                const statusMessage = runData?.statusMessage;
                const exitCode = runData?.exitCode;
                throw new Error(
                    `Apify run ${runId} finished with status: ${status}` +
                        (exitCode !== undefined ? `, exitCode: ${exitCode}` : '') +
                        (statusMessage ? `, message: ${statusMessage}` : ''),
                );
            }
            const datasetId = runData?.defaultDatasetId;
            const items = await getDatasetItems<T>(datasetId);
            return { items, actorId, runId };
        }
    }
}
