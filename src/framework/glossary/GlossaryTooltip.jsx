import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  safePolygon,
} from '@floating-ui/react';

// eslint-disable-next-line max-len
const ICON_PATH = 'M200.5,5 C92.7043077,5 5,92.6982923 5,200.5 C5,308.301708 92.7043077,396 200.5,396 C308.295692,396 396,308.301708 396,200.5 C396,92.6982923 308.295692,5 200.5,5 Z M199.939828,371.352436 C105.422315,371.352436 28.5272206,294.45734 28.5272206,199.939828 C28.5272206,105.422315 105.422315,28.5272206 199.939828,28.5272206 C294.45734,28.5272206 371.352436,105.422315 371.352436,199.939828 C371.352436,294.45734 294.45734,371.352436 199.939828,371.352436 Z M200.5,142.802292 C187.815649,142.802292 177.532951,132.770392 177.532951,120.395415 C177.532951,108.020439 187.815649,97.9885387 200.5,97.9885387 C213.184351,97.9885387 223.467049,108.020439 223.467049,120.395415 C223.467049,132.770392 213.184351,142.802292 200.5,142.802292 Z M198.819484,165.209169 C205.003782,165.209169 210.022923,170.079464 210.022923,176.092509 L210.022923,268.6009 C210.022923,274.608504 205.003782,279.484241 198.819484,279.484241 C192.635186,279.484241 187.616046,274.608504 187.616046,268.6009 L187.616046,176.092509 C187.616046,170.084905 192.635186,165.209169 198.819484,165.209169 Z';

function GlossaryTooltip({
  children,
  dataId,
  iconPosition,
  link,
  linkText,
  message,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
    ],
  });

  const hover = useHover(context, { move: false, handleClose: safePolygon() });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const button = (
    <button
      className={`glossaryTooltip__icon icon-pos-${iconPosition}`}
      data-id={dataId && `${dataId}-tooltip-button`}
      ref={refs.setReference}
      type="button"
      {...getReferenceProps()}
    >
      <svg viewBox="0 0 400 400" fill="currentColor" stroke="currentColor">
        <path d={ICON_PATH} />
      </svg>
    </button>
  );

  return (
    <Fragment>
      {iconPosition === 'before' && button}
      {children}
      {iconPosition === 'after' && button}

      {isOpen && (
        <FloatingPortal>
          <div
            className="glossaryTooltip__tooltip"
            data-id={dataId && `${dataId}-tooltip-body`}
            onClick={e => e.stopPropagation()}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div
              className="glossaryTooltip__content"
              data-id={dataId && `${dataId}-tooltip-message`}
            >
              {message}
            </div>
            {link && (
              <a
                className="glossaryTooltip__link"
                data-id={dataId && `${dataId}-tooltip-link`}
                href={link}
                rel="noopener noreferrer"
                target="_blank"
              >
                {linkText || 'Learn More'}
              </a>
            )}
          </div>
        </FloatingPortal>
      )}
    </Fragment>
  );
}

GlossaryTooltip.propTypes = {
  children: PropTypes.any,
  dataId: PropTypes.string,
  iconPosition: PropTypes.any.isRequired,
  link: PropTypes.string,
  linkText: PropTypes.string,
  message: PropTypes.string.isRequired,
};

export default GlossaryTooltip;
