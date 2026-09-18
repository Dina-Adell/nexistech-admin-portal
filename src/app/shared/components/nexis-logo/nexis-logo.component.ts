import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LogoSize = 'sm' | 'lg';

/**
 * The NexisTech wordmark. Pure type, no image asset, so it stays crisp on
 * every screen density and inherits the page's dark theme.
 */
@Component({
  selector: 'app-nexis-logo',
  templateUrl: './nexis-logo.component.html',
  styleUrl: './nexis-logo.component.scss',
  host: {
    '[class.logo--sm]': 'size() === "sm"',
    '[class.logo--lg]': 'size() === "lg"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NexisLogoComponent {
  /** Visual scale of the wordmark. */
  readonly size = input<LogoSize>('sm');
}
