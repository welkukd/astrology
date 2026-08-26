/**
 * Gaia Design System — UI Components
 * Barrel export for all reusable UI components
 */

// Design tokens
export * from '@/lib/design-tokens';

// Components
export { Button, AnchorButton } from './Button';
export type { ButtonVariant, ButtonSize } from './Button';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export type { CardVariant } from './Card';

export { Input, Textarea, Select } from './Input';
export type { InputSize } from './Input';

export { Badge } from './Badge';
export type { BadgeVariant } from './Badge';

export { Tabs, TabsList, TabTrigger, TabContent } from './Tabs';

export { Divider } from './Divider';
export type { DividerVariant } from './Divider';

export { Spinner } from './Spinner';
export type { SpinnerSize } from './Spinner';

export { Tooltip, TooltipContent } from './Tooltip';

export { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalClose } from './Modal';

export { DisclaimerBanner, DefaultDisclaimerExpandedContent } from './DisclaimerBanner';

export { GoldTriangle, GoldTriangleCorner, GoldTriangleSection } from './GoldTriangle';
export type { TriangleOrientation, TriangleSize } from './GoldTriangle';