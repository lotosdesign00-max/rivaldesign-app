import React, { useState } from 'react';
import {
  FlagshipButton,
  FlagshipCard,
  FlagshipInput,
  FlagshipModal,
  FlagshipNav,
  toast,
} from '../components';
import soundSystem from '../utils/soundSystem';

/**
 * FLAGSHIP COMPONENTS DEMO
 * Showcase all premium components
 */

export default function FlagshipDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState('');

  const handleButtonClick = () => {
    soundSystem.tap();
    toast.success('Button clicked!', { title: 'Success' });
  };

  const handleModalOpen = () => {
    soundSystem.modalOpen();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    soundSystem.modalClose();
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)' }}>
          Flagship Components
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Premium component library showcase
        </p>
      </div>

      {/* Buttons Section */}
      <FlagshipCard variant="glass" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Buttons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <FlagshipButton variant="primary" onClick={handleButtonClick}>
            Primary
          </FlagshipButton>
          <FlagshipButton variant="secondary" onClick={handleButtonClick}>
            Secondary
          </FlagshipButton>
          <FlagshipButton variant="ghost" onClick={handleButtonClick}>
            Ghost
          </FlagshipButton>
          <FlagshipButton variant="danger" onClick={handleButtonClick}>
            Danger
          </FlagshipButton>
          <FlagshipButton variant="premium" magnetic shimmer onClick={handleButtonClick}>
            Premium
          </FlagshipButton>
        </div>

        <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>Sizes</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
          <FlagshipButton size="sm" onClick={handleButtonClick}>Small</FlagshipButton>
          <FlagshipButton size="md" onClick={handleButtonClick}>Medium</FlagshipButton>
          <FlagshipButton size="lg" onClick={handleButtonClick}>Large</FlagshipButton>
          <FlagshipButton size="xl" onClick={handleButtonClick}>Extra Large</FlagshipButton>
        </div>

        <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>States</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <FlagshipButton loading>Loading</FlagshipButton>
          <FlagshipButton disabled>Disabled</FlagshipButton>
        </div>
      </FlagshipCard>

      {/* Cards Section */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
          <FlagshipCard variant="glass" hover style={{ padding: 'var(--space-4)' }}>
            <h3>Glass Card</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              Glassmorphism with backdrop blur
            </p>
          </FlagshipCard>

          <FlagshipCard variant="elevated" hover style={{ padding: 'var(--space-4)' }}>
            <h3>Elevated Card</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              Solid background with shadow
            </p>
          </FlagshipCard>

          <FlagshipCard variant="premium" parallax glow shimmer style={{ padding: 'var(--space-4)' }}>
            <h3>Premium Card</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
              All effects enabled
            </p>
          </FlagshipCard>
        </div>
      </div>

      {/* Inputs Section */}
      <FlagshipCard variant="glass" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Inputs</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <FlagshipInput
            label="Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            variant="glass"
            placeholder="Enter your name"
          />

          <FlagshipInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="premium"
            placeholder="your@email.com"
            helperText="We'll never share your email"
          />

          <FlagshipInput
            label="Message"
            value=""
            onChange={() => {}}
            multiline
            rows={4}
            maxLength={200}
            showCount
            placeholder="Type your message..."
          />
        </div>
      </FlagshipCard>

      {/* Modal Section */}
      <FlagshipCard variant="glass" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Modal</h2>
        <FlagshipButton onClick={handleModalOpen}>Open Modal</FlagshipButton>

        <FlagshipModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          title="Premium Modal"
          subtitle="With backdrop blur and spring animations"
          variant="premium"
          size="md"
          footer={
            <>
              <FlagshipButton variant="ghost" onClick={handleModalClose}>
                Cancel
              </FlagshipButton>
              <FlagshipButton variant="primary" onClick={handleModalClose}>
                Confirm
              </FlagshipButton>
            </>
          }
        >
          <p style={{ marginBottom: 'var(--space-3)' }}>
            This is a premium modal with all the flagship features:
          </p>
          <ul style={{ paddingLeft: 'var(--space-5)', color: 'var(--text-secondary)' }}>
            <li>Backdrop blur</li>
            <li>Spring animations</li>
            <li>ESC to close</li>
            <li>Click outside to close</li>
            <li>Focus trap</li>
          </ul>
        </FlagshipModal>
      </FlagshipCard>

      {/* Toast Section */}
      <FlagshipCard variant="glass" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Toasts</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <FlagshipButton
            variant="secondary"
            onClick={() => {
              soundSystem.success();
              toast.success('Operation completed successfully!', { title: 'Success' });
            }}
          >
            Success Toast
          </FlagshipButton>
          <FlagshipButton
            variant="secondary"
            onClick={() => {
              soundSystem.error();
              toast.error('Something went wrong!', { title: 'Error' });
            }}
          >
            Error Toast
          </FlagshipButton>
          <FlagshipButton
            variant="secondary"
            onClick={() => {
              soundSystem.warning();
              toast.warning('Please check your input', { title: 'Warning' });
            }}
          >
            Warning Toast
          </FlagshipButton>
          <FlagshipButton
            variant="secondary"
            onClick={() => {
              soundSystem.notification();
              toast.info('New update available', { title: 'Info' });
            }}
          >
            Info Toast
          </FlagshipButton>
        </div>
      </FlagshipCard>

      {/* Sound System */}
      <FlagshipCard variant="glass" style={{ padding: 'var(--space-5)' }}>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Sound System</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <FlagshipButton variant="secondary" onClick={() => soundSystem.tap()}>
            Tap
          </FlagshipButton>
          <FlagshipButton variant="secondary" onClick={() => soundSystem.success()}>
            Success
          </FlagshipButton>
          <FlagshipButton variant="secondary" onClick={() => soundSystem.error()}>
            Error
          </FlagshipButton>
          <FlagshipButton variant="secondary" onClick={() => soundSystem.navigate()}>
            Navigate
          </FlagshipButton>
          <FlagshipButton variant="secondary" onClick={() => soundSystem.notification()}>
            Notification
          </FlagshipButton>
        </div>
      </FlagshipCard>
    </div>
  );
}
