'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardInput } from '@/components/dashboard/DashboardInput';
import { FileUpload } from '@/components/ui/file-upload';
import {
    createHeroSection,
    deleteHeroSection,
    type BackendHeroSection,
    updateHeroSection,
} from '@/services/HeroSection';

function emptyCard() {
    return { image: '', imageAlt: '', title: '', description: '', clickUrl: '' };
}

function emptyHero() {
    return { slides: [emptyCard()], features: [emptyCard()], isActive: true };
}

export function DashboardHeroManager({ heroes }: { heroes: BackendHeroSection[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState(emptyHero());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingForm, setEditingForm] = useState(emptyHero());
    const rows = useMemo(() => heroes.slice(0, 10), [heroes]);

    function refresh(message: string, type: 'success' | 'error') {
        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }
        router.refresh();
    }

    const renderCards = (
        cards: ReturnType<typeof emptyCard>[],
        setCards: (cards: ReturnType<typeof emptyCard>[]) => void,
        label: string,
    ) => (
        <div className="space-y-3">
            <div className="text-sm font-semibold">{label}</div>
            {cards.map((card, index) => (
                <div key={`${label}-${index}`} className="space-y-3 rounded-xl border p-3">
                    <FileUpload
                        value={card.image}
                        onChange={url =>
                            setCards(cards.map((item, i) => (i === index ? { ...item, image: url } : item)))
                        }
                        placeholder="Slide image"
                    />
                    <div className="grid gap-3 md:grid-cols-3">
                        <DashboardInput
                            placeholder="Image alt"
                            value={card.imageAlt}
                            onChange={e =>
                                setCards(
                                    cards.map((item, i) =>
                                        i === index ? { ...item, imageAlt: e.target.value } : item,
                                    ),
                                )
                            }
                        />
                        <DashboardInput
                            placeholder="Title"
                            value={card.title}
                            onChange={e =>
                                setCards(
                                    cards.map((item, i) =>
                                        i === index ? { ...item, title: e.target.value } : item,
                                    ),
                                )
                            }
                        />
                        <DashboardInput
                            placeholder="Click URL"
                            value={card.clickUrl}
                            onChange={e =>
                                setCards(
                                    cards.map((item, i) =>
                                        i === index ? { ...item, clickUrl: e.target.value } : item,
                                    ),
                                )
                            }
                        />
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => setCards([...cards, emptyCard()])}>
                <Plus className="mr-2 size-4" />
                Add {label.slice(0, -1)}
            </Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Create hero section</CardTitle>
                    <CardDescription>Create a backend-managed hero bundle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {renderCards(form.slides, slides => setForm({ ...form, slides }), 'Slides')}
                    {renderCards(form.features, features => setForm({ ...form, features }), 'Features')}
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={e => setForm({ ...form, isActive: e.target.checked })}
                        />
                        Active
                    </label>
                    <Button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            startTransition(async () => {
                                const result = await createHeroSection(form);
                                if (!result?.success)
                                    return refresh(
                                        result?.message ?? 'Failed to create hero section.',
                                        'error',
                                    );
                                setForm(emptyHero());
                                refresh(result.message ?? 'Hero section created successfully.', 'success');
                            })
                        }
                    >
                        Create hero section
                    </Button>
                </CardContent>
            </Card>
            <div className="space-y-4">
                {rows.map(hero => {
                    const isEditing = editingId === hero._id;
                    const active = isEditing ? editingForm : hero;
                    return (
                        <Card key={hero._id ?? hero.slides[0]?.title ?? 'hero-section'} className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Hero bundle</CardTitle>
                                <CardDescription>
                                    {hero.slides.length} slides · {hero.features.length} features
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {renderCards(
                                    active.slides as ReturnType<typeof emptyCard>[],
                                    slides => isEditing && setEditingForm({ ...editingForm, slides }),
                                    'Slides',
                                )}
                                {renderCards(
                                    active.features as ReturnType<typeof emptyCard>[],
                                    features => isEditing && setEditingForm({ ...editingForm, features }),
                                    'Features',
                                )}
                                <div className="flex justify-end gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                disabled={isPending || !hero._id}
                                                onClick={() => {
                                                    const heroId = hero._id;
                                                    if (!heroId) return;
                                                    startTransition(async () => {
                                                        const result = await updateHeroSection(
                                                            heroId,
                                                            editingForm,
                                                        );
                                                        if (!result?.success)
                                                            return refresh(
                                                                result?.message ??
                                                                    'Failed to update hero section.',
                                                                'error',
                                                            );
                                                        setEditingId(null);
                                                        refresh(
                                                            result.message ??
                                                                'Hero section updated successfully.',
                                                            'success',
                                                        );
                                                    });
                                                }}
                                            >
                                                Save
                                            </Button>
                                            <Button variant="outline" onClick={() => setEditingId(null)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingId(hero._id ?? null);
                                                    setEditingForm({
                                                        slides: hero.slides,
                                                        features: hero.features,
                                                        isActive: hero.isActive,
                                                    });
                                                }}
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                disabled={isPending || !hero._id}
                                                onClick={() => {
                                                    const heroId = hero._id;
                                                    if (!heroId) return;
                                                    startTransition(async () => {
                                                        const result = await deleteHeroSection(heroId);
                                                        if (!result?.success)
                                                            return refresh(
                                                                result?.message ??
                                                                    'Failed to delete hero section.',
                                                                'error',
                                                            );
                                                        refresh(
                                                            result.message ??
                                                                'Hero section deleted successfully.',
                                                            'success',
                                                        );
                                                    });
                                                }}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
