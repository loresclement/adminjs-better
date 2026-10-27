declare module '@clement_lores/admin-design-system' {
  export const DEFAULT_DRAWER_WIDTH: any
  export const Box: any
  export const cssClass: any
  export const Header: any
  export const Text: any
  export const Badge: any
  export const Button: any
  export const Link: any
  export const Label: any
  export const DrawerContent: any
  export const DrawerFooter: any
  export const Icon: any
  export const MessageBox: any
  export const Table: any
  export const TableBody: any
  export const TableCell: any
  export const TableRow: any
  export const Pagination: any
  export const ButtonGroup: any
  export const ButtonCSS: any
  export const Modal: any
  export const Loader: any
  export const H2: any
  export const H3: any
  export const H5: any
  export const Illustration: any
  export const Drawer: any
  export const InfoBox: any
  export const DropDown: any
  export const DropDownItem: any
  export const DropDownMenu: any
  export const DropDownTrigger: any
  export const CurrentUserNav: any
  export const Placeholder: any
  export const CheckBox: any
  export const TableHead: any
  export const TableCaption: any
  export const Title: any
  export const themeGet: any
  export const MadeWithLove: any
  export const Navigation: any
  export const Overlay: any
  export const FormGroup: any
  export const Input: any
  export const Section: any
  export const FormMessage: any
  export const ValueGroup: any
  export const Select: any
  export const CurrencyInput: any
  export const formatCurrencyProperty: any
  export const DatePicker: any
  export const formatDateProperty: any
  export const InputGroup: any
  export const PhoneInput: any
  export const SelectAsync: any
  export const RichTextEditor: any
  export const TinyMCE: any
  export const Tooltip: any
  export const combineStyles: any

  export type IconProps = any
  export type VariantType = any
  export type BoxProps = any
  export type HeaderProps = any
  export type TextProps = any
  export type BadgeProps = any
  export type ButtonProps = any
  export type LinkProps = any
  export type LabelProps = any
  export type ButtonGroupProps = any
  export type ButtonInGroupProps = any
  export type IllustrationProps = any
  export type CurrentUserNavProps = any
  export type MessageBoxProps = any
  export type NavigationElementProps = any
  export type CurrencyInputProps = any
  export type PhoneInputProps = any
  export type ModalProps = any
  export type NavigationElementWithChildrenProps = any
  export type NavigationProps = any
  export type Theme = any
}

declare module '@clement_lores/admin-design-system/styled-components' {
  type StyledInterpolation = string | number | ((props: any) => any)
  type StyledTemplate = {
    <Props = any>(
      strings: TemplateStringsArray,
      ...interpolations: StyledInterpolation[]
    ): any
  }

  interface StyledFactory {
    <Props = any>(component: (props: any) => any): StyledTemplate
    <Component = any>(component: Component): StyledTemplate
    [key: string]: any
  }

  export const styled: StyledFactory
  export const ThemeProvider: any
}
