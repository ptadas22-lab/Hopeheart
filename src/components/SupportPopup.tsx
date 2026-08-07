interface SupportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onNavigateTo: (screenId: string) => void;
}

export default function SupportPopup(_props: SupportPopupProps) {
  return null;
}
