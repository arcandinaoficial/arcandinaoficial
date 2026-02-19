'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import New from '@/components/New';
import Button from '@/components/Button';
import Image from '@/components/Image';
import NewsSectionMiniCarousel from '@/components/NewsSectionMiniCarousel';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const postsPath = `${basePath}/data/noticias/news-list.json`;
const SESSION_TOKEN_KEY = 'arc_admin_google_id_token';
const EXPIRED_SESSION_MESSAGE =
    'Tu sesión de Google expiró. Vuelve a iniciar sesión para continuar.';
const PUBLISH_TIMEOUT_MS = 120000;

const initialSharedFormState = {
    slug: '',
    bannerImagePath: '',
    otherImagePaths: [],
    hasBannerButton: false,
    hasArticleButton: false,
    bannerButtonLink: '',
    articleButtonLink: '',
};

const initialLangFormState = {
    bannerTitle1: '',
    bannerTitle2: '',
    bannerSubtitle: '',
    bannerButtonText: '',
    date: '',
    articleTitle: '',
    articleParagraphsText: '',
    articleButtonText: '',
};

const initialEnTouchedState = {
    bannerTitle1: false,
    bannerTitle2: false,
    bannerSubtitle: false,
    bannerButtonText: false,
    date: false,
    articleTitle: false,
    articleParagraphsText: false,
    articleButtonText: false,
};

function slugify(text) {
    return (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function toNewsModel(json) {
    if (json && Array.isArray(json.es) && Array.isArray(json.en)) {
        return { es: json.es, en: json.en };
    }
    if (Array.isArray(json?.es)) {
        return { es: json.es, en: [] };
    }
    if (Array.isArray(json)) {
        return { es: json, en: [] };
    }
    if (Array.isArray(json?.posts)) {
        return { es: json.posts, en: [] };
    }
    return { es: [], en: [] };
}

function getPreviewTitle(post) {
    return post?.articleTitle || post?.bannerTitle2 || post?.id || 'Sin titulo';
}

function getPreviewExcerpt(post) {
    if (Array.isArray(post?.articleParagraphs) && post.articleParagraphs.length > 0) {
        return post.articleParagraphs[0];
    }
    return post?.bannerSubtitle || '';
}

function parseParagraphs(text) {
    return (text || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

function normalizeFileName(fileName) {
    return (fileName || '').trim().replace(/\s+/g, '-');
}

function buildImagePath(slug, fileName) {
    return `/news/${slug}/${normalizeFileName(fileName)}`;
}

function repairMojibake(text) {
    const value = String(text || '');
    if (!value || !/[ÃÂâð]/.test(value)) return value;
    try {
        const bytes = Uint8Array.from([...value].map((char) => char.charCodeAt(0) & 0xff));
        const repaired = new TextDecoder('utf-8').decode(bytes);
        return repaired || value;
    } catch {
        return value;
    }
}

function resolvePreviewImageSrc(path) {
    const raw = repairMojibake(String(path || '').trim());
    if (!raw) return '';
    if (
        raw.startsWith('blob:') ||
        raw.startsWith('data:') ||
        raw.startsWith('http://') ||
        raw.startsWith('https://') ||
        raw.startsWith('//')
    ) {
        return raw;
    }
    // Keep canonical production media routes untouched.
    if (raw.startsWith('/news/')) {
        return raw;
    }
    if (basePath && raw.startsWith('/') && !raw.startsWith(`${basePath}/`) && raw !== basePath) {
        return `${basePath}${raw}`;
    }
    return raw;
}

function normalizeUrl(value) {
    const link = String(value || '').trim();
    if (!link) return '';

    if (
        link.startsWith('http://') ||
        link.startsWith('https://') ||
        link.startsWith('mailto:') ||
        link.startsWith('tel:') ||
        link.startsWith('/') ||
        link.startsWith('#')
    ) {
        return link;
    }
    if (link.startsWith('//')) {
        return `https:${link}`;
    }
    return `https://${link}`;
}

function clonePostsModel(model) {
    return {
        es: Array.isArray(model?.es) ? model.es.map((post) => ({ ...post })) : [],
        en: Array.isArray(model?.en) ? model.en.map((post) => ({ ...post })) : [],
    };
}

function isSamePost(a, b) {
    const sanitize = (post) => {
        if (!post || typeof post !== 'object') return {};
        const sanitized = {};
        Object.keys(post).forEach((key) => {
            if (!key.startsWith('_')) {
                sanitized[key] = post[key];
            }
        });
        return sanitized;
    };
    return JSON.stringify(sanitize(a)) === JSON.stringify(sanitize(b));
}

function mergeUniqueFilesByPath(existingFiles, incomingFiles, slug) {
    const byPath = new Map();
    for (const file of existingFiles) {
        byPath.set(buildImagePath(slug, file.name), file);
    }
    let added = 0;
    let skipped = 0;
    for (const file of incomingFiles) {
        const key = buildImagePath(slug, file.name);
        if (byPath.has(key)) {
            skipped += 1;
            continue;
        }
        byPath.set(key, file);
        added += 1;
    }
    return {
        files: Array.from(byPath.values()),
        added,
        skipped,
    };
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error(`No se pudo leer el archivo ${file?.name || ''}`));
        reader.readAsDataURL(file);
    });
}

async function buildPublishImagesPayload(posts, localPreviewFilesById) {
    const pathToFile = new Map();
    const postsEs = Array.isArray(posts?.es) ? posts.es : [];

    for (const post of postsEs) {
        const postId = String(post?.id || '').trim();
        if (!postId) continue;

        const localFiles = localPreviewFilesById.get(postId);
        if (!localFiles) continue;

        const bannerFile = localFiles.bannerImageFile || null;
        const otherFiles = Array.isArray(localFiles.otherImageFiles) ? localFiles.otherImageFiles : [];
        const files = [bannerFile, ...otherFiles].filter(Boolean);
        if (files.length === 0) continue;

        const validImagePaths = new Set(
            (Array.isArray(post.images) ? post.images : []).map((path) => repairMojibake(String(path || '').trim()))
        );

        for (const file of files) {
            const normalizedPath = buildImagePath(postId, file.name);
            if (!validImagePaths.has(normalizedPath)) {
                continue;
            }
            pathToFile.set(normalizedPath, file);
        }
    }

    const imageEntries = Array.from(pathToFile.entries());
    const payload = await Promise.all(
        imageEntries.map(async ([path, file]) => {
            const dataUrl = await fileToDataUrl(file);
            const commaIndex = dataUrl.indexOf(',');
            const contentBase64 = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : '';

            return {
                path,
                fileName: normalizeFileName(file.name),
                mimeType: file.type || 'application/octet-stream',
                size: Number(file.size || 0),
                lastModified: Number(file.lastModified || 0),
                contentBase64,
            };
        })
    );

    return payload;
}

function RequiredTag() {
    return <small className="admin-page__required-tag">(requerido)</small>;
}

function IncludeSwitch({ label, enabled, onToggle }) {
    return (
        <div className="admin-page__switch-row">
            <span className="admin-page__switch-label">{label}</span>
            <button
                type="button"
                className={`admin-page__switch ${enabled ? 'admin-page__switch--on' : ''}`}
                onClick={onToggle}
                aria-pressed={enabled}
            >
                <span className="admin-page__switch-track">
                    <span className="admin-page__switch-thumb" />
                </span>
                <span className="admin-page__switch-text">{enabled ? 'Sí Incluir' : 'No incluir'}</span>
            </button>
        </div>
    );
}

function extractErrorMessageFromBody(rawText) {
    if (!rawText) return '';
    try {
        const parsed = JSON.parse(rawText);
        return parsed?.error || parsed?.message || rawText;
    } catch {
        return rawText;
    }
}

function getFriendlyAuthMessage(rawMessage, statusCode) {
    const text = String(rawMessage || '').toLowerCase();
    if (
        statusCode === 401 ||
        statusCode === 403 ||
        text.includes('token used too late') ||
        text.includes('jwt expired') ||
        text.includes('expired') ||
        text.includes('invalid token')
    ) {
        return EXPIRED_SESSION_MESSAGE;
    }
    if (text.includes('forbidden') || text.includes('not authorized') || text.includes('not allowed')) {
        return 'Tu cuenta no está autorizada para usar este panel.';
    }
    return 'No se pudo validar tu sesión. Inicia sesión de nuevo.';
}

async function translateEsToEn(text, cache) {
    const value = (text || '').trim();
    if (!value) return '';
    if (cache.has(value)) return cache.get(value);

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(value)}&langpair=es|en`
        );
        if (!response.ok) {
            cache.set(value, value);
            return value;
        }
        const body = await response.json();
        const translated = (body?.responseData?.translatedText || '').trim();
        const finalValue = translated || value;
        cache.set(value, finalValue);
        return finalValue;
    } catch {
        cache.set(value, value);
        return value;
    }
}

export default function AdminPage() {
    const [idToken, setIdToken] = useState('');
    const [authStatus, setAuthStatus] = useState('logged_out');
    const [authMessage, setAuthMessage] = useState('');
    const [postsData, setPostsData] = useState({ es: [], en: [] });
    const [lastPublishedPosts, setLastPublishedPosts] = useState({ es: [], en: [] });
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [creatingPost, setCreatingPost] = useState(false);
    const [publishMessage, setPublishMessage] = useState('');
    const [publishError, setPublishError] = useState('');
    const [formError, setFormError] = useState('');
    const [activeLang, setActiveLang] = useState('es');
    const [sharedForm, setSharedForm] = useState(initialSharedFormState);
    const [esForm, setEsForm] = useState(initialLangFormState);
    const [enForm, setEnForm] = useState(initialLangFormState);
    const [enTouched, setEnTouched] = useState(initialEnTouchedState);
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [otherImageFiles, setOtherImageFiles] = useState([]);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState('');
    const [otherPreviewUrls, setOtherPreviewUrls] = useState([]);
    const [otherImagesNotice, setOtherImagesNotice] = useState('');
    const [editingPostId, setEditingPostId] = useState(null);
    const [draftBeforeEdit, setDraftBeforeEdit] = useState(null);

    const buttonRef = useRef(null);
    const toastRef = useRef(null);
    const bannerFileInputRef = useRef(null);
    const otherFilesInputRef = useRef(null);
    const initializedRef = useRef(false);
    const translationCacheRef = useRef(new Map());
    const translationRunRef = useRef(0);
    const translationDebounceRef = useRef(null);
    const localPreviewFilesRef = useRef(new Map());

    const loggedIn = authStatus === 'authorized';

    const pushToast = useCallback((message) => {
        toastRef.current?.show(message);
    }, []);

    const clearToasts = useCallback(() => {
        toastRef.current?.clear();
    }, []);

    const resetSession = useCallback(() => {
        setIdToken('');
        setAuthStatus('logged_out');
        setAuthMessage('');
        setPostsData({ es: [], en: [] });
        setPublishMessage('');
        setPublishError('');
        if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
        }
    }, []);

    const logoutWithMessage = useCallback(
        (message) => {
            resetSession();
            setAuthStatus('logged_out');
            setAuthMessage(message);
        },
        [resetSession]
    );

    const fetchPosts = useCallback(async () => {
        setLoadingPosts(true);
        setPublishError('');
        try {
            let model = null;
            if (backendUrl) {
                const response = await fetch(`${backendUrl}/news`, { cache: 'no-store' });
                if (!response.ok) {
                    const raw = await response.text().catch(() => '');
                    throw new Error(
                        extractErrorMessageFromBody(raw) || `No se pudo cargar las noticias (${response.status})`
                    );
                }
                const json = await response.json().catch(() => ({}));
                model = toNewsModel(json?.posts || json);
            } else {
                const response = await fetch(postsPath, { cache: 'no-store' });
                if (!response.ok) {
                    if (response.status === 404) {
                        const localJsonModule = await import('@/data/noticias/news-list.json');
                        const localJson = localJsonModule?.default || localJsonModule;
                        model = toNewsModel(localJson);
                    } else {
                        throw new Error(`No se pudo cargar las noticias (${response.status})`);
                    }
                } else {
                    const json = await response.json();
                    model = toNewsModel(json);
                }
            }
            setPostsData(model);
            setLastPublishedPosts(clonePostsModel(model));
        } catch (error) {
            setPublishError(error.message || 'No se pudo cargar las noticias');
            pushToast({
                severity: 'error',
                summary: 'Error al cargar',
                detail: error.message || 'No se pudo cargar las noticias',
                life: 4200,
            });
        } finally {
            setLoadingPosts(false);
        }
    }, [pushToast]);

    const testAuthorization = useCallback(
        async (token) => {
            if (!backendUrl) {
                setAuthStatus('error');
                setAuthMessage('Falta NEXT_PUBLIC_BACKEND_URL');
                return false;
            }
            try {
                const response = await fetch(`${backendUrl}/auth/test`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 401 || response.status === 403) {
                    const raw = await response.text().catch(() => '');
                    logoutWithMessage(getFriendlyAuthMessage(raw, response.status));
                    return false;
                }
                if (!response.ok) {
                    const text = await response.text();
                    const backendMessage = extractErrorMessageFromBody(text);
                    throw new Error(backendMessage || 'Fallo la autorizacion');
                }
                setAuthStatus('authorized');
                setAuthMessage('');
                return true;
            } catch (error) {
                const friendly = getFriendlyAuthMessage(error.message);
                logoutWithMessage(friendly);
                return false;
            }
        },
        [logoutWithMessage]
    );

    const renderGoogleLoginButton = useCallback(() => {
        if (typeof window === 'undefined' || !window.google || !buttonRef.current) return;

        if (!initializedRef.current) {
            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: async (response) => {
                    const token = response?.credential;
                    if (!token) return;

                    setIdToken(token);
                    window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
                    const ok = await testAuthorization(token);
                    if (ok) {
                        await fetchPosts();
                    }
                },
            });
            initializedRef.current = true;
        }

        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 260,
        });
    }, [fetchPosts, testAuthorization]);

    useEffect(() => {
        if (!googleClientId) {
            setAuthStatus('error');
            setAuthMessage('Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID');
            return;
        }

        const existingToken =
            typeof window !== 'undefined' ? window.sessionStorage.getItem(SESSION_TOKEN_KEY) : '';
        if (existingToken) {
            setIdToken(existingToken);
            testAuthorization(existingToken).then((ok) => {
                if (ok) fetchPosts();
            });
        }

        let script = document.querySelector('script[data-gis-client="1"]');
        if (!script) {
            script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.setAttribute('data-gis-client', '1');
            document.body.appendChild(script);
        }
        script.addEventListener('load', renderGoogleLoginButton);
        renderGoogleLoginButton();

        return () => {
            script.removeEventListener('load', renderGoogleLoginButton);
        };
    }, [fetchPosts, renderGoogleLoginButton, testAuthorization]);

    useEffect(() => {
        if (!loggedIn) {
            renderGoogleLoginButton();
        }
    }, [loggedIn, renderGoogleLoginButton]);

    useEffect(() => {
        if (translationDebounceRef.current) {
            clearTimeout(translationDebounceRef.current);
        }

        translationDebounceRef.current = setTimeout(async () => {
            const runId = ++translationRunRef.current;
            const cache = translationCacheRef.current;

            const updates = {};
            if (!enTouched.bannerTitle1) {
                updates.bannerTitle1 = await translateEsToEn(esForm.bannerTitle1, cache);
            }
            if (!enTouched.bannerTitle2) {
                updates.bannerTitle2 = await translateEsToEn(esForm.bannerTitle2, cache);
            }
            if (!enTouched.bannerSubtitle) {
                updates.bannerSubtitle = await translateEsToEn(esForm.bannerSubtitle, cache);
            }
            if (!enTouched.date) {
                updates.date = await translateEsToEn(esForm.date, cache);
            }
            if (!enTouched.articleTitle) {
                updates.articleTitle = await translateEsToEn(esForm.articleTitle, cache);
            }
            if (!enTouched.bannerButtonText) {
                updates.bannerButtonText = await translateEsToEn(esForm.bannerButtonText, cache);
            }
            if (!enTouched.articleButtonText) {
                updates.articleButtonText = await translateEsToEn(esForm.articleButtonText, cache);
            }
            if (!enTouched.articleParagraphsText) {
                const lines = (esForm.articleParagraphsText || '').split('\n');
                const translatedLines = await Promise.all(lines.map((line) => translateEsToEn(line, cache)));
                updates.articleParagraphsText = translatedLines.join('\n');
            }

            if (runId !== translationRunRef.current) return;
            setEnForm((prev) => ({ ...prev, ...updates }));
        }, 350);

        return () => {
            if (translationDebounceRef.current) {
                clearTimeout(translationDebounceRef.current);
            }
        };
    }, [esForm, enTouched]);

    const imageSlug = useMemo(() => slugify(sharedForm.slug.trim()) || 'nueva-noticia', [sharedForm.slug]);

    useEffect(() => {
        setSharedForm((prev) => {
            const nextBannerImagePath = bannerImageFile
                ? buildImagePath(imageSlug, bannerImageFile.name)
                : editingPostId
                    ? prev.bannerImagePath
                    : '';
            const nextOtherImagePaths =
                otherImageFiles.length > 0
                    ? otherImageFiles.map((file) => buildImagePath(imageSlug, file.name))
                    : editingPostId
                        ? prev.otherImagePaths
                        : [];

            if (
                prev.bannerImagePath === nextBannerImagePath &&
                prev.otherImagePaths === nextOtherImagePaths
            ) {
                return prev;
            }

            return {
                ...prev,
                bannerImagePath: nextBannerImagePath,
                otherImagePaths: nextOtherImagePaths,
            };
        });
    }, [bannerImageFile, editingPostId, imageSlug, otherImageFiles]);

    useEffect(() => {
        if (!bannerImageFile) {
            setBannerPreviewUrl('');
            return;
        }
        const url = URL.createObjectURL(bannerImageFile);
        setBannerPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [bannerImageFile]);

    useEffect(() => {
        if (otherImageFiles.length === 0) {
            setOtherPreviewUrls([]);
            return;
        }
        const urls = otherImageFiles.map((file) => URL.createObjectURL(file));
        setOtherPreviewUrls(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [otherImageFiles]);

    const postCountText = useMemo(() => `${postsData.es.length} noticia(s)`, [postsData.es.length]);
    const pendingChanges = useMemo(() => {
        const publishedById = new Map((lastPublishedPosts.es || []).map((post) => [post.id, post]));
        const currentById = new Map((postsData.es || []).map((post) => [post.id, post]));
        const unpublishedIds = new Set();
        const changedPosts = [];
        const deletedIds = [];

        for (const post of postsData.es || []) {
            const published = publishedById.get(post.id);
            if (!published || !isSamePost(post, published)) {
                unpublishedIds.add(post.id);
                changedPosts.push(post);
            }
        }

        let deletedCount = 0;
        for (const published of lastPublishedPosts.es || []) {
            if (!currentById.has(published.id)) {
                deletedCount += 1;
                deletedIds.push(published.id);
            }
        }

        return {
            unpublishedIds,
            changedPosts,
            deletedIds,
            deletedCount,
            hasPending: changedPosts.length > 0 || deletedCount > 0,
        };
    }, [lastPublishedPosts.es, postsData.es]);
    const publishStatusClass = publishError
        ? 'admin-page__message admin-page__message--error'
        : 'admin-page__message admin-page__message--success';
    const previewDict = useMemo(
        () => ({
            shareNewButton: activeLang === 'es' ? 'Compartir noticia' : 'Share news',
            toasts: {
                shareNewTitle: activeLang === 'es' ? 'Enlace copiado' : 'Link copied',
                shareNewDescription:
                    activeLang === 'es' ? 'El enlace de la noticia se copio.' : 'The news link was copied.',
                shareNewErrorTitle: activeLang === 'es' ? 'No se pudo copiar' : 'Could not copy',
                shareNewErrorDescription:
                    activeLang === 'es' ? 'Puedes usar este enlace:' : 'You can use this link:',
            },
        }),
        [activeLang]
    );
    const previewSlide = useMemo(() => {
        const langForm = activeLang === 'es' ? esForm : enForm;
        const id = slugify(sharedForm.slug.trim()) || 'preview-noticia';
        const bannerImage = bannerPreviewUrl || resolvePreviewImageSrc(sharedForm.bannerImagePath.trim());
        const images = [];
        if (bannerImage) images.push(bannerImage);
        const additionalImages =
            otherPreviewUrls.length > 0
                ? otherPreviewUrls
                : (sharedForm.otherImagePaths || []).map((path) => resolvePreviewImageSrc(path));
        if (additionalImages.length > 0) {
            images.push(...additionalImages.filter(Boolean));
        }

        return {
            id,
            className: id,
            bannerTitle1: langForm.bannerTitle1 || (activeLang === 'es' ? 'Titulo 1' : 'Title 1'),
            bannerTitle2: langForm.bannerTitle2 || (activeLang === 'es' ? 'Titulo 2' : 'Title 2'),
            bannerSubtitle:
                langForm.bannerSubtitle ||
                (activeLang === 'es' ? 'Subtitulo del banner' : 'Banner subtitle'),
            hasBannerButton: sharedForm.hasBannerButton,
            bannerButtonText: langForm.bannerButtonText,
            bannerButtonLink: sharedForm.bannerButtonLink,
            images,
            date: langForm.date || (activeLang === 'es' ? 'Fecha' : 'Date'),
            articleTitle: langForm.articleTitle || (activeLang === 'es' ? 'Titulo del articulo' : 'Article title'),
            articleParagraphs: parseParagraphs(langForm.articleParagraphsText).length
                ? parseParagraphs(langForm.articleParagraphsText)
                : [activeLang === 'es' ? 'Aqui veras los parrafos de la noticia.' : 'You will see the article paragraphs here.'],
            hasArticleButton: sharedForm.hasArticleButton,
            articleButtonText: langForm.articleButtonText,
            articleButtonLink: sharedForm.articleButtonLink,
        };
    }, [activeLang, bannerPreviewUrl, enForm, esForm, otherPreviewUrls, sharedForm]);
    const previewBannerImage = useMemo(() => {
        const src = previewSlide.images?.[0] || '';
        if (!src) return { srcWebp: '', srcPng: '', srcJpg: '' };
        if (src.startsWith('blob:') || src.startsWith('data:')) {
            return { srcWebp: '', srcPng: '', srcJpg: src };
        }

        const lower = src.toLowerCase();
        if (lower.endsWith('.webp')) {
            return {
                srcWebp: src,
                srcPng: '',
                srcJpg: src.replace(/\.webp$/i, '.jpg'),
            };
        }
        if (lower.endsWith('.png')) {
            return {
                srcWebp: '',
                srcPng: src,
                srcJpg: '',
            };
        }
        return {
            srcWebp: '',
            srcPng: '',
            srcJpg: src,
        };
    }, [previewSlide.images]);

    const hasCurrentDraft = useCallback(() => {
        const hasSharedValues =
            Boolean(sharedForm.slug?.trim()) ||
            Boolean(sharedForm.bannerImagePath) ||
            (sharedForm.otherImagePaths?.length || 0) > 0 ||
            Boolean(sharedForm.bannerButtonLink?.trim()) ||
            Boolean(sharedForm.articleButtonLink?.trim()) ||
            sharedForm.hasBannerButton ||
            sharedForm.hasArticleButton;

        const hasEsValues = Object.values(esForm).some((value) => String(value || '').trim() !== '');
        const hasEnValues = Object.values(enForm).some((value) => String(value || '').trim() !== '');
        const hasFiles = Boolean(bannerImageFile) || otherImageFiles.length > 0;

        return hasSharedValues || hasEsValues || hasEnValues || hasFiles;
    }, [bannerImageFile, enForm, esForm, otherImageFiles.length, sharedForm]);

    const snapshotCurrentDraft = useCallback(() => {
        return {
            sharedForm: { ...sharedForm },
            esForm: { ...esForm },
            enForm: { ...enForm },
            enTouched: { ...enTouched },
            bannerImageFile,
            otherImageFiles: [...otherImageFiles],
            otherImagesNotice,
            activeLang,
        };
    }, [activeLang, bannerImageFile, enForm, enTouched, esForm, otherImageFiles, otherImagesNotice, sharedForm]);

    const restoreDraft = useCallback((draft) => {
        if (!draft) return;
        setSharedForm(draft.sharedForm || initialSharedFormState);
        setEsForm(draft.esForm || initialLangFormState);
        setEnForm(draft.enForm || initialLangFormState);
        setEnTouched(draft.enTouched || initialEnTouchedState);
        setBannerImageFile(draft.bannerImageFile || null);
        setOtherImageFiles(draft.otherImageFiles || []);
        setOtherImagesNotice(draft.otherImagesNotice || '');
        setActiveLang(draft.activeLang || 'es');
    }, []);

    const clearFileInputs = useCallback(() => {
        if (bannerFileInputRef.current) {
            bannerFileInputRef.current.value = '';
        }
        if (otherFilesInputRef.current) {
            otherFilesInputRef.current.value = '';
        }
    }, []);

    const startEditingPost = useCallback(
        (postId) => {
            const postEs = postsData.es.find((item) => item.id === postId);
            if (!postEs) return;

            const postEn = postsData.en.find((item) => item.id === postId) || postEs;

            if (!editingPostId && hasCurrentDraft()) {
                setDraftBeforeEdit(snapshotCurrentDraft());
            } else if (!editingPostId) {
                setDraftBeforeEdit(null);
            }

            const images = Array.isArray(postEs.images) ? postEs.images : [];
            const [bannerImagePath = '', ...otherImagePaths] = images.map((img) => repairMojibake(img));
            const localPreviewFiles = localPreviewFilesRef.current.get(postId);

            setEditingPostId(postId);
            setBannerPreviewUrl('');
            setOtherPreviewUrls([]);

            setSharedForm({
                slug: postEs.id || '',
                bannerImagePath,
                otherImagePaths,
                hasBannerButton: Boolean(postEs.hasBannerButton),
                hasArticleButton: Boolean(postEs.hasArticleButton),
                bannerButtonLink: postEs.bannerButtonLink || '',
                articleButtonLink: postEs.articleButtonLink || '',
            });

            setEsForm({
                bannerTitle1: postEs.bannerTitle1 || '',
                bannerTitle2: postEs.bannerTitle2 || '',
                bannerSubtitle: postEs.bannerSubtitle || '',
                bannerButtonText: postEs.bannerButtonText || '',
                date: postEs.date || '',
                articleTitle: postEs.articleTitle || '',
                articleParagraphsText: Array.isArray(postEs.articleParagraphs)
                    ? postEs.articleParagraphs.join('\n')
                    : '',
                articleButtonText: postEs.articleButtonText || '',
            });

            setEnForm({
                bannerTitle1: postEn.bannerTitle1 || '',
                bannerTitle2: postEn.bannerTitle2 || '',
                bannerSubtitle: postEn.bannerSubtitle || '',
                bannerButtonText: postEn.bannerButtonText || '',
                date: postEn.date || '',
                articleTitle: postEn.articleTitle || '',
                articleParagraphsText: Array.isArray(postEn.articleParagraphs)
                    ? postEn.articleParagraphs.join('\n')
                    : '',
                articleButtonText: postEn.articleButtonText || '',
            });

            setEnTouched({
                bannerTitle1: true,
                bannerTitle2: true,
                bannerSubtitle: true,
                bannerButtonText: true,
                date: true,
                articleTitle: true,
                articleParagraphsText: true,
                articleButtonText: true,
            });

            setBannerImageFile(localPreviewFiles?.bannerImageFile || null);
            setOtherImageFiles(localPreviewFiles?.otherImageFiles || []);
            setOtherImagesNotice('');
            setFormError('');
            clearFileInputs();
        },
        [clearFileInputs, editingPostId, hasCurrentDraft, postsData.en, postsData.es, snapshotCurrentDraft]
    );

    const resetForm = () => {
        setSharedForm(initialSharedFormState);
        setBannerImageFile(null);
        setOtherImageFiles([]);
        setBannerPreviewUrl('');
        setOtherPreviewUrls([]);
        setOtherImagesNotice('');
        setEsForm(initialLangFormState);
        setEnForm(initialLangFormState);
        setEnTouched(initialEnTouchedState);
        setFormError('');
        setActiveLang('es');
        setEditingPostId(null);
        setDraftBeforeEdit(null);
        clearFileInputs();
    };

    const cancelEditing = () => {
        const draft = draftBeforeEdit;
        setEditingPostId(null);
        setDraftBeforeEdit(null);
        setFormError('');
        if (draft) {
            restoreDraft(draft);
            return;
        }
        resetForm();
    };

    const showClearFormConfirm = () => {
        confirmDialog({
            group: 'admin-clear-form',
            header: 'Limpiar formulario',
            message: (
                <div className="admin-confirm-dialog__content">
                    <i className="pi pi-exclamation-triangle admin-confirm-dialog__icon" />
                    <span className="admin-confirm-dialog__text">
                        ¿Seguro que quieres limpiar el formulario? Se perderán los cambios no guardados.
                    </span>
                </div>
            ),
            accept: resetForm,
            reject: () => { },
        });
    };

    const showDeleteNewsConfirm = (postId, postTitle) => {
        confirmDialog({
            group: 'admin-clear-form',
            header: 'Eliminar noticia',
            message: (
                <div className="admin-confirm-dialog__content">
                    <i className="pi pi-exclamation-triangle admin-confirm-dialog__icon" />
                    <span className="admin-confirm-dialog__text">
                        ¿Eliminar {postTitle || 'esta noticia'}?
                    </span>
                </div>
            ),
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => handleDelete(postId),
            reject: () => { },
        });
    };

    const showPublishConfirm = () => {
        confirmDialog({
            group: 'admin-clear-form',
            header: 'Confirmar publicación',
            message: (
                <div className="admin-confirm-dialog__content admin-confirm-dialog__content--stacked">
                    <span className="admin-confirm-dialog__text">
                        Estás a punto de publicar {pendingChanges.changedPosts.length} noticia(s) modificada(s)
                        {pendingChanges.deletedCount > 0 ? ` y ${pendingChanges.deletedCount} eliminación(es)` : ''}. Revisa el resumen:
                    </span>
                    <ul className="admin-confirm-dialog__list">
                        {pendingChanges.changedPosts.map((post, index) => (
                            <li className="admin-confirm-dialog__list-item" key={`publish-${post.id}-${index}`}>
                                <strong>{getPreviewTitle(post)}</strong>
                                <span>{post?.date || 'Sin fecha'}</span>
                            </li>
                        ))}
                        {pendingChanges.deletedCount > 0 ? (
                            <li className="admin-confirm-dialog__list-item" key="publish-deleted-count">
                                <strong>Noticias eliminadas</strong>
                                <span>{pendingChanges.deletedCount}</span>
                            </li>
                        ) : null}
                    </ul>
                </div>
            ),
            acceptLabel: 'Sí, publicar',
            rejectLabel: 'Cancelar',
            accept: handlePublish,
            reject: () => { },
        });
    };

    const handleCreatePost = async (event) => {
        event.preventDefault();
        setFormError('');
        const id = slugify(sharedForm.slug.trim());
        const bannerImage = sharedForm.bannerImagePath.trim();
        const otherImages = sharedForm.otherImagePaths || [];
        const esBannerTitle1 = esForm.bannerTitle1.trim();
        const esBannerTitle2 = esForm.bannerTitle2.trim();
        const esBannerSubtitle = esForm.bannerSubtitle.trim();
        const esDate = esForm.date.trim();
        const esArticleTitle = esForm.articleTitle.trim();
        const esParagraphs = parseParagraphs(esForm.articleParagraphsText);
        const esBannerButtonText = esForm.bannerButtonText.trim();
        const esArticleButtonText = esForm.articleButtonText.trim();
        const bannerButtonLink = normalizeUrl(sharedForm.bannerButtonLink);
        const articleButtonLink = normalizeUrl(sharedForm.articleButtonLink);
        const enBannerTitle1 = enForm.bannerTitle1.trim();
        const enBannerTitle2 = enForm.bannerTitle2.trim();
        const enBannerSubtitle = enForm.bannerSubtitle.trim();
        const enDate = enForm.date.trim();
        const enArticleTitle = enForm.articleTitle.trim();
        const enParagraphs = parseParagraphs(enForm.articleParagraphsText);
        const enBannerButtonText = enForm.bannerButtonText.trim();
        const enArticleButtonText = enForm.articleButtonText.trim();
        if (!id || !bannerImage) {
            setFormError('Slug e imagen principal son obligatorios.');
            return;
        }
        if (!esBannerTitle1 || !esBannerTitle2 || !esBannerSubtitle || !esDate || !esArticleTitle || esParagraphs.length === 0) {
            setFormError('Completa todos los campos obligatorios en ES.');
            return;
        }
        if (!enBannerTitle1 || !enBannerTitle2 || !enBannerSubtitle || !enDate || !enArticleTitle || enParagraphs.length === 0) {
            setFormError('Completa todos los campos obligatorios en EN.');
            return;
        }
        if (sharedForm.hasBannerButton && (!esBannerButtonText || !enBannerButtonText)) {
            setFormError('Completa el texto del boton del banner en ES y EN.');
            return;
        }
        if (sharedForm.hasBannerButton && !bannerButtonLink) {
            setFormError('Completa el link del boton del banner.');
            return;
        }
        if (sharedForm.hasArticleButton && (!esArticleButtonText || !enArticleButtonText)) {
            setFormError('Completa el texto del boton del articulo en ES y EN.');
            return;
        }
        if (sharedForm.hasArticleButton && !articleButtonLink) {
            setFormError('Completa el link del boton del articulo.');
            return;
        }
        if (postsData.es.some((post) => post.id === id && post.id !== editingPostId)) {
            setFormError('Ya existe una noticia con ese slug/id.');
            return;
        }
        setCreatingPost(true);
        setPublishMessage('');
        setPublishError('');
        const images = [bannerImage, ...otherImages.filter(Boolean)];
        const hasLocalPreviewFiles = Boolean(bannerImageFile) || otherImageFiles.length > 0;
        if (hasLocalPreviewFiles) {
            localPreviewFilesRef.current.set(id, {
                bannerImageFile: bannerImageFile || null,
                otherImageFiles: [...otherImageFiles],
            });
        } else {
            localPreviewFilesRef.current.delete(id);
        }
        if (editingPostId && editingPostId !== id) {
            localPreviewFilesRef.current.delete(editingPostId);
        }
        const spanishPost = {
            id,
            className: id,
            bannerTitle1: esBannerTitle1,
            bannerTitle2: esBannerTitle2,
            bannerSubtitle: esBannerSubtitle,
            hasBannerButton: sharedForm.hasBannerButton,
            bannerButtonText: sharedForm.hasBannerButton ? esBannerButtonText : '',
            bannerButtonLink: sharedForm.hasBannerButton ? bannerButtonLink : '',
            images,
            date: esDate,
            articleTitle: esArticleTitle,
            articleParagraphs: esParagraphs,
            hasArticleButton: sharedForm.hasArticleButton,
            articleButtonText: sharedForm.hasArticleButton ? esArticleButtonText : '',
            articleButtonLink: sharedForm.hasArticleButton ? articleButtonLink : '',
        };
        const englishPost = {
            id,
            className: id,
            bannerTitle1: enBannerTitle1,
            bannerTitle2: enBannerTitle2,
            bannerSubtitle: enBannerSubtitle,
            hasBannerButton: sharedForm.hasBannerButton,
            bannerButtonText: sharedForm.hasBannerButton ? enBannerButtonText : '',
            bannerButtonLink: sharedForm.hasBannerButton ? bannerButtonLink : '',
            images: [...images],
            date: enDate,
            articleTitle: enArticleTitle,
            articleParagraphs: enParagraphs,
            hasArticleButton: sharedForm.hasArticleButton,
            articleButtonText: sharedForm.hasArticleButton ? enArticleButtonText : '',
            articleButtonLink: sharedForm.hasArticleButton ? articleButtonLink : '',
        };
        if (editingPostId) {
            setPostsData((prev) => ({
                es: prev.es.map((post) => (post.id === editingPostId ? spanishPost : post)),
                en: prev.en.map((post) => (post.id === editingPostId ? englishPost : post)),
            }));
        } else {
            setPostsData((prev) => ({
                es: [spanishPost, ...prev.es],
                en: [englishPost, ...prev.en],
            }));
        }
        clearToasts();
        pushToast({
            severity: 'success',
            summary: editingPostId ? 'Noticia editada en lista local' : 'Noticia agregada a lista local',
            detail: 'Se publicara en el sitio solo cuando hagas clic en Publicar.',
            life: 3000,
        });
        setCreatingPost(false);
        if (editingPostId) {
            const draft = draftBeforeEdit;
            setEditingPostId(null);
            setDraftBeforeEdit(null);
            if (draft) {
                restoreDraft(draft);
            } else {
                resetForm();
            }
        } else {
            resetForm();
        }
    };
    const handleDelete = async (postId) => {
        localPreviewFilesRef.current.delete(postId);
        setPostsData((prev) => ({
            es: prev.es.filter((post) => post.id !== postId),
            en: prev.en.filter((post) => post.id !== postId),
        }));
        setPublishMessage('');
        setPublishError('');
        clearToasts();
        pushToast({
            severity: 'warn',
            summary: 'Noticia eliminada de lista local',
            detail: 'El cambio se enviara al sitio cuando publiques.',
            life: 3200,
        });
    };
    const handlePublish = async () => {
        if (!backendUrl) {
            setPublishError('Falta NEXT_PUBLIC_BACKEND_URL');
            pushToast({
                severity: 'error',
                summary: 'Error al publicar',
                detail: 'Falta NEXT_PUBLIC_BACKEND_URL',
                life: 4200,
            });
            return;
        }
        setPublishLoading(true);
        setPublishMessage('');
        setPublishError('');
        clearToasts();
        pushToast({
            severity: 'info',
            summary: 'Publicando...',
            detail: 'Enviando noticias al backend',
            sticky: true,
        });

        try {
            const images = await buildPublishImagesPayload(postsData, localPreviewFilesRef.current);
            const changedPostIds = pendingChanges.changedPosts.map((post) => post.id);
            const deletedPostIds = [...pendingChanges.deletedIds];
            const uploadedImagePaths = images.map((image) => image.path);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), PUBLISH_TIMEOUT_MS);
            const response = await fetch(`${backendUrl}/publish`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
                body: JSON.stringify({
                    posts: postsData,
                    images,
                    publishMeta: {
                        fullSnapshot: true,
                        changedPostIds,
                        deletedPostIds,
                        uploadedImagePaths,
                    },
                }),
            });
            clearTimeout(timeoutId);

            if (response.status === 401 || response.status === 403) {
                const raw = await response.text().catch(() => '');
                const friendly = getFriendlyAuthMessage(raw, response.status);
                logoutWithMessage(friendly);
                setPublishError(friendly);
                clearToasts();
                pushToast({
                    severity: 'error',
                    summary: 'Sesion invalida',
                    detail: friendly,
                    life: 4200,
                });
                return;
            }

            const rawBody = await response.text().catch(() => '');
            let body = {};
            try {
                body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
                body = {};
            }
            if (!response.ok) {
                const backendMessage =
                    body?.error ||
                    body?.message ||
                    extractErrorMessageFromBody(rawBody) ||
                    `Fallo la publicacion (${response.status})`;
                const friendly = getFriendlyAuthMessage(backendMessage, response.status);
                if (friendly === EXPIRED_SESSION_MESSAGE) {
                    logoutWithMessage(friendly);
                    setPublishError(friendly);
                    clearToasts();
                    pushToast({
                        severity: 'error',
                        summary: 'Sesion invalida',
                        detail: friendly,
                        life: 4200,
                    });
                    return;
                }
                throw new Error(backendMessage);
            }

            setPublishMessage(`Publicado. Commit: ${body?.commit || 'ok'}`);
            setLastPublishedPosts(clonePostsModel(postsData));
            localPreviewFilesRef.current.clear();
            clearToasts();
            pushToast({
                severity: 'success',
                summary: 'Publicacion exitosa',
                detail: `Commit: ${body?.commit || 'ok'}`,
                life: 3200,
            });
            setTimeout(() => {
                fetchPosts();
            }, 1500);
        } catch (error) {
            const isTimeout = error?.name === 'AbortError';
            const detail = isTimeout
                ? 'La publicacion tardo demasiado y se cancelo. Revisa logs del backend o reduce el tamano de imagenes.'
                : error.message || 'Fallo la publicacion';
            setPublishError(detail);
            clearToasts();
            pushToast({
                severity: 'error',
                summary: 'Error al publicar',
                detail,
                life: 4200,
            });
        } finally {
            setPublishLoading(false);
        }
    };

    return (
        <main className="admin-page">
            <Toast ref={toastRef} appendTo={() => document.body} />
            <ConfirmDialog
                className="confirm-dialog admin-confirm-dialog"
                group="admin-clear-form"
                acceptLabel="Sí, limpiar"
                rejectLabel="Cancelar"
                acceptClassName="button button--primary"
                rejectClassName="button button--transparent"
            />
            <section className="admin-page__shell">
                <header className="admin-page__header">
                    <h1 className="admin-page__title">Administrador</h1>
                    <p className="admin-page__subtitle">
                        Crea noticias con el formato oficial (ES/EN), revisa el texto en ingles y publica el JSON completo.
                    </p>
                </header>

                {!loggedIn ? (
                    <section className="admin-page__card">
                        <p className="admin-page__hint">Inicia sesion con Google para continuar.</p>
                        <div className="admin-page__google-login" ref={buttonRef} />
                        {authMessage ? <p className="admin-page__message admin-page__message--error">{authMessage}</p> : null}
                    </section>
                ) : (
                    <>
                        <section className="admin-page__card admin-page__card--top">
                            <div className="admin-page__status">
                                <strong>{postCountText}</strong>
                                <span className={`admin-page__badge ${pendingChanges.hasPending ? 'admin-page__badge--dirty' : ''}`}>
                                    {pendingChanges.hasPending ? 'Cambios sin publicar' : 'Todo publicado'}
                                </span>
                            </div>
                            <div className="admin-page__top-actions">
                                <button
                                    className={`button button--secondary ${
                                        !pendingChanges.hasPending ? 'admin-page__publish-button--disabled' : ''
                                    }`}
                                    type="button"
                                    disabled={publishLoading || creatingPost || !pendingChanges.hasPending}
                                    onClick={showPublishConfirm}
                                >
                                    {publishLoading ? 'Publicando...' : 'Publicar en el sitio'}
                                </button>
                                <button className="button button--transparent" type="button" onClick={resetSession}>
                                    Cerrar sesion
                                </button>
                            </div>
                            {(publishMessage || publishError) ? (
                                <div className="admin-page__top-feedback">
                                    {publishMessage ? <span className={publishStatusClass}>{publishMessage}</span> : null}
                                    {publishError ? <span className={publishStatusClass}>{publishError}</span> : null}
                                </div>
                            ) : null}
                        </section>

                        <section className="admin-page__card">
                            <h2 className="admin-page__section-title">Vista previa</h2>
                            <p className="admin-page__hint">
                                La vista previa usa el mismo componente visual del sitio para el idioma activo.
                            </p>
                            <div className="admin-page__preview">
                                <div className={`news-section-carousel admin-page__preview-banner ${previewSlide.className || ''}`}>
                                    <div className="news-section-carousel__image-section">
                                        <div className="news-section-carousel__slide">
                                            <div className="news-section-carousel__parallax">
                                                <div className="news-section-carousel__parallax__layer">
                                                    <Image
                                                        className="news-section-carousel__slide__img news-section-carousel__parallax__img"
                                                        srcWebp={previewBannerImage.srcWebp}
                                                        srcPng={previewBannerImage.srcPng}
                                                        srcJpg={previewBannerImage.srcJpg}
                                                        alt={`Imagen de ${previewSlide.articleTitle || 'noticia'}`}
                                                        width={800}
                                                        height={600}
                                                    />
                                                </div>
                                            </div>
                                            <div className="news-section-carousel__outline" />
                                            <div className="news-section-carousel__text">
                                                <h4 className="news-section-carousel__text__title">
                                                    <span>{previewSlide.bannerTitle1}</span>
                                                    <span>{previewSlide.bannerTitle2}</span>
                                                </h4>
                                                <p className="news-section-carousel__text__description">
                                                    {previewSlide.bannerSubtitle}
                                                </p>
                                                {previewSlide.hasBannerButton ? (
                                                    <Button
                                                        className="carousel__text__button"
                                                        actionType="redirect"
                                                        onClick={previewSlide.bannerButtonLink}
                                                        label={previewSlide.bannerButtonText}
                                                        disabled={!previewSlide.bannerButtonLink}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {previewSlide.images?.length > 1 ? (
                                    <NewsSectionMiniCarousel
                                        images={previewSlide.images.slice(1)}
                                        onRemoveImage={(index) => {
                                            setOtherImageFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
                                            setSharedForm((prev) => ({
                                                ...prev,
                                                otherImagePaths: prev.otherImagePaths.filter((_, pathIndex) => pathIndex !== index),
                                            }));
                                        }}
                                    />
                                ) : null}
                                <New slide={previewSlide} dict={previewDict} lang={activeLang} />
                            </div>
                        </section>

                        <section className="admin-page__card">
                            <div className="admin-page__card-header">
                                <h2 className="admin-page__section-title">
                                    {editingPostId
                                        ? activeLang === 'en'
                                            ? 'Edit news'
                                            : 'Editar noticia'
                                        : activeLang === 'en'
                                            ? 'Create news'
                                            : 'Crear noticia'}
                                </h2>
                                <div className="admin-page__lang-toggle">
                                    <button
                                        type="button"
                                        className={`admin-page__lang-button ${activeLang === 'es' ? 'admin-page__lang-button--active' : ''}`}
                                        onClick={() => setActiveLang('es')}
                                    >
                                        Español (ES)
                                    </button>
                                    <button
                                        type="button"
                                        className={`admin-page__lang-button ${activeLang === 'en' ? 'admin-page__lang-button--active' : ''}`}
                                        onClick={() => setActiveLang('en')}
                                    >
                                        English (EN)
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleCreatePost} className="admin-page__form">
                                <label className="admin-page__field admin-page__field--full">
                                    <span>
                                        Slug (id/className) <RequiredTag />
                                    </span>
                                    <input
                                        value={sharedForm.slug}
                                        onChange={(event) => setSharedForm((prev) => ({ ...prev, slug: event.target.value }))}
                                        required
                                        type="text"
                                        placeholder="cuento-infinito"
                                    />
                                </label>
                                <label className="admin-page__field">
                                    <span>
                                        Imagen principal (banner) <RequiredTag />
                                    </span>
                                    <input
                                        ref={bannerFileInputRef}
                                        required={!editingPostId && !sharedForm.bannerImagePath.trim()}
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0] || null;
                                            if (!file) {
                                                setBannerImageFile(null);
                                                return;
                                            }
                                            if (!file.type.startsWith('image/')) {
                                                setFormError('Solo se permiten archivos de imagen.');
                                                event.target.value = '';
                                                return;
                                            }
                                            setFormError('');
                                            setBannerImageFile(file);
                                        }}
                                    />
                                    {editingPostId && sharedForm.bannerImagePath ? (
                                        <small className="admin-page__hint">
                                            Usando imagen actual. Solo selecciona un archivo si deseas reemplazarla.
                                        </small>
                                    ) : null}
                                </label>

                                <label className="admin-page__field">
                                    <span>Otras imagenes</span>
                                    <div className="admin-page__file-actions">
                                        {otherImageFiles.length > 0 ? (
                                            <button
                                                className="button admin-page__danger-button"
                                                type="button"
                                                onClick={() => {
                                                    setOtherImageFiles([]);
                                                    setOtherImagesNotice('');
                                                    setSharedForm((prev) => ({ ...prev, otherImagePaths: [] }));
                                                }}
                                            >
                                                Borrar
                                            </button>
                                        ) : null}
                                        <input
                                            ref={otherFilesInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(event) => {
                                                const files = Array.from(event.target.files || []);
                                                if (files.length === 0) {
                                                    return;
                                                }
                                                if (files.some((file) => !file.type.startsWith('image/'))) {
                                                    setFormError('Solo se permiten archivos de imagen.');
                                                    event.target.value = '';
                                                    return;
                                                }
                                                setFormError('');
                                                setOtherImageFiles((prev) => {
                                                    const result = mergeUniqueFilesByPath(prev, files, imageSlug);
                                                    if (result.skipped > 0) {
                                                        setOtherImagesNotice(
                                                            `Se omitieron ${result.skipped} archivo(s) con nombre repetido.`
                                                        );
                                                    } else {
                                                        setOtherImagesNotice('');
                                                    }
                                                    return result.files;
                                                });
                                            }}
                                        />
                                    </div>
                                    {otherImagesNotice ? (
                                        <small className="admin-page__message admin-page__message--error">
                                            {otherImagesNotice}
                                        </small>
                                    ) : null}
                                </label>
                                {activeLang === 'es' ? (
                                    <>
                                        <label className="admin-page__field">
                                            <span>Título Banner 1 (ES) <RequiredTag /></span>
                                            <input
                                                value={esForm.bannerTitle1}
                                                onChange={(event) => setEsForm((prev) => ({ ...prev, bannerTitle1: event.target.value }))}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <label className="admin-page__field">
                                            <span>Título Banner 2 (ES) <RequiredTag /></span>
                                            <input
                                                value={esForm.bannerTitle2}
                                                onChange={(event) => setEsForm((prev) => ({ ...prev, bannerTitle2: event.target.value }))}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <label className="admin-page__field admin-page__field--full">
                                            <span>Subtítulo Banner (ES) <RequiredTag /></span>
                                            <input
                                                value={esForm.bannerSubtitle}
                                                onChange={(event) => setEsForm((prev) => ({ ...prev, bannerSubtitle: event.target.value }))}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <div className="admin-page__button-config admin-page__field--full">
                                            <IncludeSwitch
                                                label="Incluir botón en banner"
                                                enabled={sharedForm.hasBannerButton}
                                                onToggle={() =>
                                                    setSharedForm((prev) => ({ ...prev, hasBannerButton: !prev.hasBannerButton }))
                                                }
                                            />
                                            <label className="admin-page__field">
                                                <span>
                                                    Texto (ES) {sharedForm.hasBannerButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={esForm.bannerButtonText}
                                                    onChange={(event) => setEsForm((prev) => ({ ...prev, bannerButtonText: event.target.value }))}
                                                    type="text"
                                                    required={sharedForm.hasBannerButton}
                                                    disabled={!sharedForm.hasBannerButton}
                                                />
                                            </label>
                                            <label className="admin-page__field">
                                                <span>
                                                    Link (URL) {sharedForm.hasBannerButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={sharedForm.bannerButtonLink}
                                                    onChange={(event) =>
                                                        setSharedForm((prev) => ({ ...prev, bannerButtonLink: event.target.value }))
                                                    }
                                                    type="text"
                                                    inputMode="url"
                                                    required={sharedForm.hasBannerButton}
                                                    placeholder="https://..."
                                                    disabled={!sharedForm.hasBannerButton}
                                                />
                                            </label>
                                        </div>
                                        <hr className="admin-page__form-divider admin-page__field--full" />
                                        <label className="admin-page__field">
                                            <span>Fecha (ES) <RequiredTag /></span>
                                            <input
                                                value={esForm.date}
                                                onChange={(event) => setEsForm((prev) => ({ ...prev, date: event.target.value }))}
                                                required
                                                type="text"
                                                placeholder="25 de abril, 2025"
                                            />
                                        </label>
                                        <label className="admin-page__field admin-page__field--full">
                                            <span>Titulo del articulo (ES) <RequiredTag /></span>
                                            <input
                                                value={esForm.articleTitle}
                                                onChange={(event) => setEsForm((prev) => ({ ...prev, articleTitle: event.target.value }))}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <label className="admin-page__field admin-page__field--full">
                                            <span>Parrafos del articulo (ES, uno por linea) <RequiredTag /></span>
                                            <textarea
                                                rows={8}
                                                value={esForm.articleParagraphsText}
                                                onChange={(event) =>
                                                    setEsForm((prev) => ({ ...prev, articleParagraphsText: event.target.value }))
                                                }
                                                required
                                            />
                                        </label>
                                        <div className="admin-page__button-config admin-page__field--full">
                                            <IncludeSwitch
                                                label="Incluir botón en artículo"
                                                enabled={sharedForm.hasArticleButton}
                                                onToggle={() =>
                                                    setSharedForm((prev) => ({ ...prev, hasArticleButton: !prev.hasArticleButton }))
                                                }
                                            />
                                            <label className="admin-page__field">
                                                <span>
                                                    Texto (ES) {sharedForm.hasArticleButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={esForm.articleButtonText}
                                                    onChange={(event) =>
                                                        setEsForm((prev) => ({ ...prev, articleButtonText: event.target.value }))
                                                    }
                                                    type="text"
                                                    required={sharedForm.hasArticleButton}
                                                    disabled={!sharedForm.hasArticleButton}
                                                />
                                            </label>
                                            <label className="admin-page__field">
                                                <span>
                                                    Link (URL) {sharedForm.hasArticleButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={sharedForm.articleButtonLink}
                                                    onChange={(event) =>
                                                        setSharedForm((prev) => ({ ...prev, articleButtonLink: event.target.value }))
                                                    }
                                                    type="text"
                                                    inputMode="url"
                                                    required={sharedForm.hasArticleButton}
                                                    placeholder="https://..."
                                                    disabled={!sharedForm.hasArticleButton}
                                                />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label className="admin-page__field">
                                            <span>Banner title 1 (EN) <RequiredTag /></span>
                                            <input
                                                value={enForm.bannerTitle1}
                                                onChange={(event) => {
                                                    setEnTouched((prev) => ({ ...prev, bannerTitle1: true }));
                                                    setEnForm((prev) => ({ ...prev, bannerTitle1: event.target.value }));
                                                }}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <label className="admin-page__field">
                                            <span>Banner title 2 (EN) <RequiredTag /></span>
                                            <input
                                                value={enForm.bannerTitle2}
                                                onChange={(event) => {
                                                    setEnTouched((prev) => ({ ...prev, bannerTitle2: true }));
                                                    setEnForm((prev) => ({ ...prev, bannerTitle2: event.target.value }));
                                                }}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <label className="admin-page__field admin-page__field--full">
                                            <span>Banner subtitle (EN) <RequiredTag /></span>
                                            <input
                                                value={enForm.bannerSubtitle}
                                                onChange={(event) => {
                                                    setEnTouched((prev) => ({ ...prev, bannerSubtitle: true }));
                                                    setEnForm((prev) => ({ ...prev, bannerSubtitle: event.target.value }));
                                                }}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <div className="admin-page__button-config admin-page__field--full">
                                            <IncludeSwitch
                                                label="Include banner button"
                                                enabled={sharedForm.hasBannerButton}
                                                onToggle={() =>
                                                    setSharedForm((prev) => ({ ...prev, hasBannerButton: !prev.hasBannerButton }))
                                                }
                                            />
                                            <label className="admin-page__field">
                                                <span>
                                                    Text (EN) {sharedForm.hasBannerButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={enForm.bannerButtonText}
                                                    onChange={(event) => {
                                                        setEnTouched((prev) => ({ ...prev, bannerButtonText: true }));
                                                        setEnForm((prev) => ({ ...prev, bannerButtonText: event.target.value }));
                                                    }}
                                                    type="text"
                                                    required={sharedForm.hasBannerButton}
                                                    disabled={!sharedForm.hasBannerButton}
                                                />
                                            </label>
                                            <label className="admin-page__field">
                                                <span>
                                                    Link (URL) {sharedForm.hasBannerButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={sharedForm.bannerButtonLink}
                                                    onChange={(event) =>
                                                        setSharedForm((prev) => ({ ...prev, bannerButtonLink: event.target.value }))
                                                    }
                                                    type="text"
                                                    inputMode="url"
                                                    required={sharedForm.hasBannerButton}
                                                    placeholder="https://..."
                                                    disabled={!sharedForm.hasBannerButton}
                                                />
                                            </label>
                                        </div>
                                        <hr className="admin-page__form-divider admin-page__field--full" />
                                        <label className="admin-page__field">
                                            <span>Date (EN) <RequiredTag /></span>
                                            <input
                                                value={enForm.date}
                                                onChange={(event) => {
                                                    setEnTouched((prev) => ({ ...prev, date: true }));
                                                    setEnForm((prev) => ({ ...prev, date: event.target.value }));
                                                }}
                                                required
                                                type="text"
                                                placeholder="April 25, 2025"
                                            />
                                        </label>
                                        <label className="admin-page__field admin-page__field--full">
                                            <span>Article title (EN) <RequiredTag /></span>
                                            <input
                                                value={enForm.articleTitle}
                                                onChange={(event) => {
                                                    setEnTouched((prev) => ({ ...prev, articleTitle: true }));
                                                    setEnForm((prev) => ({ ...prev, articleTitle: event.target.value }));
                                                }}
                                                required
                                                type="text"
                                            />
                                        </label>
                                        <label className="admin-page__field admin-page__field--full">
                                            <span>Article paragraphs (EN, one per line) <RequiredTag /></span>
                                            <textarea
                                                rows={8}
                                                value={enForm.articleParagraphsText}
                                                onChange={(event) => {
                                                    setEnTouched((prev) => ({ ...prev, articleParagraphsText: true }));
                                                    setEnForm((prev) => ({ ...prev, articleParagraphsText: event.target.value }));
                                                }}
                                                required
                                            />
                                        </label>
                                        <div className="admin-page__button-config admin-page__field--full">
                                            <IncludeSwitch
                                                label="Include article button"
                                                enabled={sharedForm.hasArticleButton}
                                                onToggle={() =>
                                                    setSharedForm((prev) => ({ ...prev, hasArticleButton: !prev.hasArticleButton }))
                                                }
                                            />
                                            <label className="admin-page__field">
                                                <span>
                                                    Text (EN) {sharedForm.hasArticleButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={enForm.articleButtonText}
                                                    onChange={(event) => {
                                                        setEnTouched((prev) => ({ ...prev, articleButtonText: true }));
                                                        setEnForm((prev) => ({ ...prev, articleButtonText: event.target.value }));
                                                    }}
                                                    type="text"
                                                    required={sharedForm.hasArticleButton}
                                                    disabled={!sharedForm.hasArticleButton}
                                                />
                                            </label>
                                            <label className="admin-page__field">
                                                <span>
                                                    Link (URL) {sharedForm.hasArticleButton ? <RequiredTag /> : null}
                                                </span>
                                                <input
                                                    value={sharedForm.articleButtonLink}
                                                    onChange={(event) =>
                                                        setSharedForm((prev) => ({ ...prev, articleButtonLink: event.target.value }))
                                                    }
                                                    type="text"
                                                    inputMode="url"
                                                    required={sharedForm.hasArticleButton}
                                                    placeholder="https://..."
                                                    disabled={!sharedForm.hasArticleButton}
                                                />
                                            </label>
                                        </div>
                                    </>
                                )}

                                <div className="admin-page__actions">
                                    <button className="button button--primary" type="submit" disabled={creatingPost}>
                                        {creatingPost
                                            ? 'Guardando...'
                                            : editingPostId
                                                ? activeLang === 'en'
                                                    ? 'Edit news'
                                                    : 'Editar noticia'
                                                : 'Agregar a la lista local'}
                                    </button>
                                    {editingPostId ? (
                                        <button className="button button--transparent" type="button" onClick={cancelEditing}>
                                            {activeLang === 'en' ? 'Cancel edit' : 'Cancelar edición'}
                                        </button>
                                    ) : (
                                        <button className="button button--transparent" type="button" onClick={showClearFormConfirm}>
                                            Limpiar formulario
                                        </button>
                                    )}
                                    {formError ? <span className="admin-page__message admin-page__message--error">{formError}</span> : null}
                                </div>
                            </form>
                        </section>

                        <section className="admin-page__card">
                            <h2 className="admin-page__section-title">Noticias</h2>
                            {loadingPosts ? <p className="admin-page__hint">Cargando noticias...</p> : null}
                            {!loadingPosts && postsData.es.length === 0 ? <p className="admin-page__hint">No se encontraron noticias.</p> : null}
                            <ul className="admin-page__list">
                                {postsData.es.map((post) => (
                                    <li
                                        className={`admin-page__list-item ${pendingChanges.unpublishedIds.has(post.id) ? 'admin-page__list-item--unpublished' : ''
                                            }`}
                                        key={post.id}
                                    >
                                        <div className="admin-page__list-content">
                                            {pendingChanges.unpublishedIds.has(post.id) ? (
                                                <small className="admin-page__unpublished-tag">Sin publicar</small>
                                            ) : null}
                                            <strong>{getPreviewTitle(post)}</strong>
                                            <span>{post?.date || 'Sin fecha'}</span>
                                            <p>{getPreviewExcerpt(post)}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                                            <button
                                                className="button button--primary"
                                                type="button"
                                                onClick={() => startEditingPost(post.id)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="button button--transparent admin-page__delete"
                                                type="button"
                                                onClick={() => showDeleteNewsConfirm(post.id, getPreviewTitle(post))}
                                            >
                                                Eliminar
                                            </button>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}
            </section>
        </main>
    );
}








