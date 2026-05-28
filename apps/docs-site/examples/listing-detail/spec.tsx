'use client';

import { type GlyphName } from '@ship-it-ui/icons';
import { InlineEdit, ListingCard, ListingDetail } from '@ship-it-ui/ui';
import { useState } from 'react';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['car', 'carFront', 'steeringWheel', 'seat', 'gauge'];

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
  const [title, setTitle] = useState('Chevrolet Corvette Stingray Convertible');
  const [category, setCategory] = useState('performance');
  const [meta, setMeta] = useState('LR-001 · 2023');
  const [zeroSixty, setZeroSixty] = useState('2.9s');
  const [power, setPower] = useState('495 hp');
  const [drive, setDrive] = useState('RWD');
  const [price, setPrice] = useState('$250');
  const [description, setDescription] = useState(
    'Mid-engine V8 in Torch Red. Stage 2 exhaust, Magnetic Ride Control, head-up display. Convertible top retracts in 16s. Pickup at Berkeley Marina.',
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
      label: '0-60',
      value: (
        <span {...editCell} className="relative z-10">
          <InlineEdit
            value={zeroSixty}
            onValueChange={setZeroSixty}
            size="sm"
            aria-label="Edit 0-60 time"
          />
        </span>
      ),
    },
    {
      label: 'Power',
      value: (
        <span {...editCell} className="relative z-10">
          <InlineEdit value={power} onValueChange={setPower} size="sm" aria-label="Edit power" />
        </span>
      ),
    },
    {
      label: 'Drive',
      value: (
        <span {...editCell} className="relative z-10">
          <InlineEdit
            value={drive}
            onValueChange={setDrive}
            size="sm"
            aria-label="Edit drive layout"
          />
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
        priceUnit="/day"
        cta={{ label: 'Rent', onClick: () => setOpen(true) }}
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
          { label: 'Top speed', value: '194 mph' },
          { label: 'Seats', value: '2' },
          { label: 'Year', value: '2023' },
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
        priceUnit="/day"
        cta={{ label: 'Rent', onClick: () => {} }}
      />
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
