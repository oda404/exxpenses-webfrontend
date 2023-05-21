import * as React from 'react';
import { Dayjs } from 'dayjs';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    DateRangePicker,
    DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
    BaseMultiInputFieldProps,
    DateRange,
    DateRangeValidationError,
    UseDateRangeFieldProps,
    MultiInputFieldSlotTextFieldProps,
    BaseSingleInputFieldProps,
    DateValidationError,
    RangeFieldSection,
    FieldSection,
} from '@mui/x-date-pickers-pro';

interface BrowserFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    InputProps?: {
        ref?: React.Ref<any>;
        endAdornment?: React.ReactNode;
        startAdornment?: React.ReactNode;
    };
    error?: boolean;
    focused?: boolean;
    ownerState?: any;
}

type BrowserFieldComponent = ((
    props: BrowserFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const BrowserField = React.forwardRef(
    (props: BrowserFieldProps, inputRef: React.Ref<HTMLInputElement>) => {
        const {
            disabled,
            id,
            label,
            InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
            // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
            error,
            focused,
            ownerState,
            ...other
        } = props;

        return (
            <Box
                id={id}
                ref={containerRef}
                sx={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#444444",
                    borderRadius: "6px",
                    paddingY: "1px",
                    paddingX: "5px",
                    // display: 'flex', alignItems: 'center', flexGrow: 1
                }}
            >
                {startAdornment}
                <input
                    style={{
                        maxWidth: "62px",
                        maxHeight: "20px",
                        background: "var(--exxpenses-second-bg-color)",
                        border: "none",
                        fontSize: "12px"
                    }}
                    disabled={disabled}
                    ref={inputRef}
                    {...other}
                />
                {endAdornment}
            </Box>
        );
    },
) as BrowserFieldComponent;

BrowserField.displayName = "BrowserField";

export interface BrowserMultiInputDateRangeFieldProps
    extends UseDateRangeFieldProps<Dayjs>,
    BaseMultiInputFieldProps<
        DateRange<Dayjs>,
        RangeFieldSection,
        DateRangeValidationError
    > { }

type BrowserMultiInputDateRangeFieldComponent = ((
    props: BrowserMultiInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const BrowserMultiInputDateRangeField = React.forwardRef(
    (props: BrowserMultiInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
        const {
            slotProps,
            value,
            defaultValue,
            format,
            onChange,
            readOnly,
            disabled,
            onError,
            shouldDisableDate,
            minDate,
            maxDate,
            disableFuture,
            disablePast,
            selectedSections,
            onSelectedSectionsChange,
            className,
        } = props;

        const { inputRef: startInputRef, ...startTextFieldProps } = useSlotProps({
            elementType: null as any,
            externalSlotProps: slotProps?.textField,
            ownerState: { ...props, position: 'start' },
        }) as MultiInputFieldSlotTextFieldProps;

        const { inputRef: endInputRef, ...endTextFieldProps } = useSlotProps({
            elementType: null as any,
            externalSlotProps: slotProps?.textField,
            ownerState: { ...props, position: 'end' },
        }) as MultiInputFieldSlotTextFieldProps;

        const { startDate, endDate } = useMultiInputDateRangeField<
            Dayjs,
            MultiInputFieldSlotTextFieldProps
        >({
            sharedProps: {
                value,
                defaultValue,
                format,
                onChange,
                readOnly,
                disabled,
                onError,
                shouldDisableDate,
                minDate,
                maxDate,
                disableFuture,
                disablePast,
                selectedSections,
                onSelectedSectionsChange,
            },
            startTextFieldProps,
            endTextFieldProps,
            startInputRef,
            endInputRef,
        });

        return (
            <Stack ref={ref} spacing={0.5} direction="row" className={className}>
                <BrowserField {...startDate} />
                <span>-</span>
                <BrowserField {...endDate} />
            </Stack>
        );
    },
) as BrowserMultiInputDateRangeFieldComponent;

BrowserMultiInputDateRangeField.displayName = "BrowserMultiInputDateRangeField";

function BrowserDateRangePicker(props: DateRangePickerProps<Dayjs>) {
    return (
        <DateRangePicker slots={{ field: BrowserMultiInputDateRangeField }} {...props} />
    );
}

export default function DateRangePickerCustom(props: DateRangePickerProps<Dayjs>) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateRangePicker']}>
                <BrowserDateRangePicker {...props} />
            </DemoContainer>
        </LocalizationProvider>
    );
}