// Dropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

type OptionItem = {
  value: string;
  label: string;
};

interface DropDownProps {
  data: OptionItem[];
  value: string | null;
  onChange: (item: OptionItem) => void;
  placeholder: string;
}

export default function Dropdown({
  data,
  value,
  onChange,
  placeholder,
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const ITEM_HEIGHT = 50; // Height of each option item

  const onSelect = (item: OptionItem) => {
    onChange(item);
    setExpanded(false);
  };

  const scrollDown = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: scrollPosition + ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  const buttonRef = useRef<TouchableOpacity>(null);

  const handlePress = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
        setExpanded(true);
      });
    }
  };

  // Find the selected item based on the `value` prop
  const selectedItem = data.find((item) => item.value === value);

  return (
    <View>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <Text style={styles.text}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <AntDesign name={expanded ? "caretup" : "caretdown"} />
      </TouchableOpacity>

      {expanded && (
        <Modal
          transparent={true}
          visible={expanded}
          animationType="none"
          onRequestClose={() => setExpanded(false)}
        >
          <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      position: "absolute",
                      top: buttonLayout.y + buttonLayout.height,
                      left: buttonLayout.x,
                      width: buttonLayout.width,
                      maxHeight:
                        Dimensions.get("window").height -
                        (buttonLayout.y + buttonLayout.height) -
                        20, // Prevents overflow beyond screen
                    },
                  ]}
                >
                  {/* Options list with padding only at the bottom for the bottom arrow */}
                  <ScrollView
                    ref={scrollViewRef}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 15 }} // Adds space only for the bottom arrow
                    onContentSizeChange={(width, height) => setContentHeight(height)}
                    onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
                    onScroll={(event) =>
                      setScrollPosition(event.nativeEvent.contentOffset.y)
                    }
                    scrollEventThrottle={16}
                  >
                    {data.map((item) => (
                      <TouchableOpacity
                        key={item.value}
                        activeOpacity={0.8}
                        style={styles.optionItem}
                        onPress={() => onSelect(item)}
                      >
                        <Text style={styles.optionText}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Bottom Arrow */}
                  {contentHeight > containerHeight &&
                    scrollPosition + containerHeight < contentHeight && (
                      <TouchableOpacity
                        style={styles.arrowContainerBottom}
                        onPress={scrollDown}
                      >
                        <AntDesign name="down" size={20} color="#333" />
                      </TouchableOpacity>
                    )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  optionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  optionItem: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  arrowContainerBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 1,
  },
});
