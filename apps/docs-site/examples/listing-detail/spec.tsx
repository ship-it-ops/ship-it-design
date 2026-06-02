'use client';

import { type GlyphName } from '@ship-it-ui/icons';
import { InlineEdit, ListingCard, ListingDetail } from '@ship-it-ui/ui';
import { useState } from 'react';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['mountain', 'home', 'sun', 'palmTree', 'wifi'];

/**
 * Stops a click from bubbling to the card's stretched onClick handler.
 * Wrap any inline editor cell so dbl-clicking to edit doesn't also
 * open the detail modal.
 */
const editCell = { onClick: (e: { stopPropagation: () => void }) => e.stopPropagation() };

function Inner() {
  const [open, setOpen] = useState(false);

  // Editable fields. Shared between the card and the modal so an edit in
  // either surface flows through to the other.
  const [title, setTitle] = useState('Ridgeline Glass House');
  const [category, setCategory] = useState('architectural');
  const [meta, setMeta] = useState('STAY-001 · est. 2019');
  const [sleeps, setSleeps] = useState('6');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [price, setPrice] = useState('$420');
  const [description, setDescription] = useState(
    'Three-bedroom retreat above the Pacific. Floor-to-ceiling glass on the west wall, wood-burning stove, hot tub on the lower deck. Self check-in from 3pm — keypad code arrives the morning of your stay.',
  );

  const editableTitle = (
    <span {...editCell} className="relative z-10">
      <InlineEdit value={title} onValueChange={setTitle} aria-label="Edit title" />
    </span>
  );
  const editableMeta = (
    <span {...editCell} className="relative z-10">
      <InlineEdit value={meta} onValueChange={setMeta} size="sm" aria-label="Edit ID and year" />
    </span>
  );
  const editableCategory = (
    <span {...editCell} className="relative z-10">
      <InlineEdit
        value={category}
        onValueChange={setCategory}
        size="sm"
        aria-label="Edit category"
      />
    </span>
  );
  const editablePrice = (
    <span {...editCell} className="relative z-10">
      <InlineEdit value={price} onValueChange={setPrice} aria-label="Edit price" />
    </span>
  );
  const editableSpecs = [
    {
      label: 'Sleeps',
      value: (
        <span {...editCell} className="relative z-10">
          <InlineEdit value={sleeps} onValueChange={setSleeps} size="sm" aria-label="Edit sleeps" />
        </span>
      ),
    },
    {
      label: 'Beds',
      value: (
        <span {...editCell} className="relative z-10">
          <InlineEdit value={beds} onValueChange={setBeds} size="sm" aria-label="Edit beds" />
        </span>
      ),
    },
    {
      label: 'Baths',
      value: (
        <span {...editCell} className="relative z-10">
          <InlineEdit value={baths} onValueChange={setBaths} size="sm" aria-label="Edit baths" />
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-text-muted text-[12px]">
        Click the card to view details. Double-click any field (title, category, meta, specs, price)
        to edit in place — edits flow through to the modal.
      </p>
      <ListingCard
        variant="spec"
        photos={photos}
        renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
        onClick={() => setOpen(true)}
        hoverEffect="lift"
        flag={{ icon: 'flag', label: 'Flagship', tone: 'purple' }}
        title={editableTitle}
        category={editableCategory}
        meta={editableMeta}
        specs={editableSpecs}
        pricePrefix="from"
        price={editablePrice}
        priceUnit="/night"
        cta={{ label: 'Book', onClick: () => setOpen(true) }}
      />
      <ListingDetail
        variant="spec"
        open={open}
        onOpenChange={setOpen}
        photos={photos}
        renderPhoto={(name, _i, mode) => (
          <ExamplePhoto icon={name as GlyphName} mode={mode === 'lightbox' ? 'contain' : 'cover'} />
        )}
        flag={{ icon: 'flag', label: 'Flagship', tone: 'purple' }}
        title={editableTitle}
        category={editableCategory}
        meta={editableMeta}
        specs={[
          ...editableSpecs,
          { label: 'View', value: 'Ocean' },
          { label: 'Min stay', value: '2 nights' },
          { label: 'Built', value: '2019' },
        ]}
        description={
          <span {...editCell}>
            <InlineEdit
              value={description}
              onValueChange={setDescription}
              size="sm"
              aria-label="Edit description"
            />
          </span>
        }
        pricePrefix="from"
        price={editablePrice}
        priceUnit="/night"
        cta={{ label: 'Book', onClick: () => {} }}
      />
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
