'use client';

/**
 * @deprecated This registry is deprecated. Use CLIENT_COMPONENTS from src/app/_components.tsx instead.
 * This adapter is provided for backward compatibility.
 */

import { CLIENT_COMPONENTS } from '../app/_components';
import type { ClientComponentKey } from '../app/_components';

export const clientComponentRegistry = CLIENT_COMPONENTS;
export type { ClientComponentKey };
