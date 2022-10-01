import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Alert, { AlertType } from '../Components/Alerts/Alert';
import Icon from '../Components/Icon/Icon';

describe('alert tests', () => {
    test('it should render all props passed', () => {
        const handleClick: undefined | (() => void) = jest.fn();
        const handleClose: (() => void) | undefined = jest.fn();
        render(
         <Alert
             title="title"
             strongTitle="strong"
             type={AlertType.SUCCESS}
             onClick={handleClick}
             onClose={handleClose}
           />
        );
        expect(Icon).toBeInTheDocument;
        expect(handleClick).toBeCalled;
        expect(handleClose).toBeCalled;
    });
    test('it should show icon when alert type is equal to success', () => {
        render(<Alert type={AlertType.SUCCESS} />);
        expect(Icon).toBeInTheDocument;
    });
    test('it should show icon when alert type is equal to info', () => {
        render(<Alert type={AlertType.INFO} />);
        expect(Icon).toBeInTheDocument;
    });
    test('it should show icon when alert type is equal to warning', () => {
        render(<Alert type={AlertType.WARNING} />)
        expect(Icon).toBeInTheDocument;
    }); 
    test('it should show icon when alert type is equal to danger', () => {
        render(<Alert type={AlertType.DANGER} />)
        expect(Icon).toBeInTheDocument;
    });
    test('it should have a title displayed in document', () => {
        render(<Alert title="title" />);
        expect(screen.getByText('title')).toBeInTheDocument;
    });
  test('it should have a strong text displayed in document ', () => {
        render(<Alert strongTitle="strong" />);
        expect(screen.getByText('strong')).toBeInTheDocument;
  });
  test('it should handle onClick event', () => {
       const handleClick: (() => void) | undefined = jest.fn();
      render(<Alert title="title" onClick={handleClick} />);
        fireEvent.click(screen.getByText('title'));
        expect(handleClick).toBeCalled;
});
    test('it should handle onClose event', () => {
        const handleClose: undefined | (() => void) = jest.fn();
       render(<Alert title="title" onClose={handleClose} />);
        fireEvent.click(screen.getByText('title'));
        expect(handleClose).toBeCalled;
    });
    test('it should  display button  onClose event', () => {
        const handleClose: undefined | (() => void) = jest.fn();
       render(<Alert onClose={handleClose} />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toBeVisible();
    });
});
