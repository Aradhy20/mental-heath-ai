
import os
import re

FRONTEND_DIR = r"d:\mental  health app\frontend"

replacements = {
    # Layout upgrades
    r'@/components/ui/Navbar': '@/components/layout/Navbar',
    r'@/components/ui/Sidebar': '@/components/layout/Sidebar',
    r'@/components/anti-gravity/MobileBottomNav': '@/components/layout/MobileBottomNav',
    r'@/components/Navigation': '@/components/layout/Navigation',
    
    # Feature upgrades
    r'@/components/ui/AIChatbot': '@/components/features/AIChatbot',
    r'@/components/ui/BreathingExercise': '@/components/features/BreathingExercise',
    r'@/components/ui/DoctorFinder': '@/components/features/DoctorFinder',
    r'@/components/ui/EmotionHeatmap': '@/components/features/EmotionHeatmap',
    r'@/components/ui/JournalEntry': '@/components/features/JournalEntry',
    r'@/components/ui/MoodTracker': '@/components/features/MoodTracker',
    r'@/components/ui/RecommendationCarousel': '@/components/features/RecommendationCarousel',
    r'@/components/FaceAnalyzer': '@/components/features/FaceAnalyzer',
    r'@/components/VoiceAnalyzer': '@/components/features/VoiceAnalyzer',
    r'@/components/FusionResults': '@/components/features/FusionResults',
    
    # Animations upgrades - Generic pattern for Animated*
    r'@/components/Animated': '@/components/animations/Animated',
    r'@/components/StaggeredAnimationContainer': '@/components/animations/StaggeredAnimationContainer',
}

# Specific fix for "AnimatedButton" if it was in ui
replacements[r'@/components/ui/AnimatedButton'] = '@/components/animations/AnimatedButton'


def update_imports():
    count = 0
    for root, dirs, files in os.walk(FRONTEND_DIR):
        # Exclude node_modules and .next
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')
            
        for file in files:
            if not file.endswith(('.tsx', '.ts')):
                continue
            
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            for old, new in replacements.items():
                # Regular expression to handle variations like quotes
                # We look for "old" followed by quote or slash
                pattern = f"(['\"]){old}" 
                content = re.sub(pattern, f"\\1{new}", content)

            # Special case for Animated* wildcard if missed (simpler string replace for bulk moved files)
            # If the import was directly from "@/components/Animated..." it is now "@/components/animations/Animated..."
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {path}")
                count += 1
    print(f"Finished updating {count} files.")

if __name__ == "__main__":
    update_imports()
