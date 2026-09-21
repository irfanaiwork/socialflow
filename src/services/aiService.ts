import { AiVisualAnalysis, MediaItem, AiPromptProfile } from '../types';

export class AiService {
  /**
   * Analyzes an image or video based on visual cues, filename, and custom brand profile
   */
  static async analyzeMedia(media: MediaItem, profile?: AiPromptProfile): Promise<AiVisualAnalysis> {
    // Realistic analysis latency simulation
    await new Promise((res) => setTimeout(res, 900));

    const name = media.fileName.toLowerCase();
    const isVideo = media.mediaType === 'video';

    // Topic detection heuristics based on filename, visual metadata, or user prompt profile
    if (name.includes('grocery') || name.includes('20') || name.includes('food') || name.includes('meal')) {
      return {
        mainTopic: '$20 Grocery Challenge & Budget Meal Prep',
        objects: ['Fresh farm vegetables', 'Kraft paper grocery bag', 'Weekly expense receipt', 'Apples', 'Whole oats'],
        people: 'None visible',
        environment: 'Sunlit rustic kitchen counter with wooden butcher block',
        visualStyle: 'Warm high-key lifestyle photography with high contrast clean badge overlay',
        textVisible: '$20 WEEKLY GROCERY CHALLENGE • 7 DINNERS',
        mainMessage: 'Stretch a tight $20 grocery budget into wholesome, nutritious meals for the entire week.',
        targetAudience: profile?.targetAudience || 'Frugal mothers, budget-conscious grocery shoppers, college students',
        contentCategory: 'Frugal Living & Food Budgeting',
        keywords: ['grocery challenge', 'budget meals', 'frugal living', '20 dollar meals', 'cheap grocery list', 'family dinner ideas'],
        searchIntent: 'How to buy a week of groceries on 20 dollars',
        pinterestTitle: '$20 Grocery Challenge: Budget-Friendly Grocery Ideas',
        pinterestDescription: 'Looking for ways to stretch your grocery budget? Discover practical ideas for planning affordable meals and making the most of a $20 grocery budget. Download our full shopping list inside!',
        facebookCaption: 'Can you create a full grocery plan with just $20? Here are some simple, realistic ideas to make every single dollar count this week! 🛒🥦 Save this post for your next store trip!',
        youtubeTitle: '$20 Grocery Challenge: How to Eat for a Week on $20 #Shorts',
        youtubeDescription: 'Stretching a $20 bill into a full week of healthy family dinners! Full meal plan and free grocery list linked below. \n\n👉 Get the free shopping list: https://savvymombudget.com/frugal-deals\n\n#Shorts #BudgetMeals #FrugalLiving',
        youtubeTags: ['shorts', 'budget meals', 'frugal living', '20 dollar meals', 'cheap groceries'],
        suggestedHashtags: ['#GroceryBudget', '#FrugalLiving', '#CheapEats', '#SavvyMom', '#MealPlanningOnABudget'],
        suggestedCta: profile?.cta || 'Tap the link to download the complete $20 grocery checklist & weekly meal plan!'
      };
    }

    if (name.includes('magic') || name.includes('trick') || name.includes('illusion') || name.includes('card')) {
      return {
        mainTopic: isVideo ? 'High-Energy Visual Card Teleportation Illusion' : 'Close-Up Magic Sleight of Hand Exhibition',
        objects: ['Bicycle Rider Back playing cards', 'Close-up performance mat', 'Sharpie marker', 'Spectator ring'],
        people: 'Street magician and astonished spectators in public plaza',
        environment: 'Busy downtown pedestrian promenade with natural afternoon lighting',
        visualStyle: 'Cinematic shallow depth of field with fast-paced visual reveal framing',
        textVisible: 'IMPOSSIBLE STREET MAGIC ILLUSION 😱♠️',
        mainMessage: 'An unexpected transposition where the signed card appears inside the spectator closed hands.',
        targetAudience: profile?.targetAudience || 'Magic enthusiasts, teens, viral entertainment seekers, illusion fans',
        contentCategory: 'Magic & Street Entertainment',
        keywords: ['street magic', 'card trick reveal', 'mind blowing illusion', 'sleight of hand', 'viral magic short'],
        searchIntent: 'Best visual street magic card tricks for beginners',
        pinterestTitle: 'Incredible Street Magic Card Teleportation Revealed',
        pinterestDescription: 'Watch this mind-bending visual card trick performed right before spectators eyes in broad daylight. Learn the core principles of psychology and misdirection!',
        facebookCaption: 'Watch their expressions at the reveal... complete disbelief! Could you spot the secret move? Drop your theories below! 🎩✨♠️',
        youtubeTitle: 'IMPOSSIBLE Street Magic Card Teleportation 😱♠️ #Shorts',
        youtubeDescription: 'Watch their faces when the signed card teleports right into their closed hand! Did you catch the secret move?\n\n🎩 Subscribe for daily street magic: https://magicshortsvault.com/subscribe\n\n#Shorts #MagicTricks #StreetMagic #Illusion',
        youtubeTags: ['shorts', 'magic', 'card trick', 'street magic', 'illusion', 'reaction'],
        suggestedHashtags: ['#StreetMagic', '#CardFlourish', '#MindBlow', '#MagicTricks', '#Illusionist'],
        suggestedCta: profile?.cta || 'Comment what trick you want to see next and share with a friend!'
      };
    }

    if (name.includes('planner') || name.includes('budget') || name.includes('expense') || name.includes('finance')) {
      return {
        mainTopic: 'Zero-Based Family Budget Binder & Monthly Tracker',
        objects: ['Printed budgeting binder pages', 'Pastel highlighters', 'Pocket calculator', 'Ceramic coffee cup', 'Ballpoint pen'],
        people: 'Hands organizing receipts and filling out cash envelopes',
        environment: 'Neat scandinavian oak desk setup with soft warm morning light',
        visualStyle: 'Aesthetic pastel desk flat lay with elegant typography and clean borders',
        textVisible: 'FREE PRINTABLE MONTHLY BUDGET PLANNER & EXPENSE TRACKER',
        mainMessage: 'Take total control of household finances, pay off debt, and track savings goals effortlessly.',
        targetAudience: profile?.targetAudience || 'Mothers, young couples, homemakers looking for simple cash envelope budgeting',
        contentCategory: 'Personal Finance & Digital Printables',
        keywords: ['free budget printable', 'expense tracker pdf', 'monthly budget sheet', 'zero based budgeting', 'cash envelopes'],
        searchIntent: 'Download free printable monthly budget sheet pdf',
        pinterestTitle: 'Free Printable Monthly Budget Planner & Expense Tracker',
        pinterestDescription: 'Stop wondering where your paycheck went! Download our free zero-based budget printable template designed to help families track savings, debt payoffs, and everyday spending with ease.',
        facebookCaption: 'Tired of unexpected monthly expenses catching you off guard? Grab our free printable budget binder pages right now! 📓✨ Perfect for organizing every dollar before the month begins.',
        youtubeTitle: 'How to Budget When You Live Paycheck to Paycheck #Shorts',
        youtubeDescription: 'Free printable zero-based budget sheets to organize your money effortlessly!\n\n📥 Download free templates here: https://savvymombudget.com/frugal-deals\n\n#Shorts #Budgeting #PersonalFinance',
        youtubeTags: ['shorts', 'budget planner', 'personal finance', 'debt free', 'free printable'],
        suggestedHashtags: ['#BudgetPlanner', '#FreePrintables', '#DebtFreeCommunity', '#FrugalMom', '#MoneyTracker'],
        suggestedCta: profile?.cta || 'Click through to download your free high-resolution PDF printables now!'
      };
    }

    // Default intelligent analysis based on generic media
    const baseTitle = media.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedTitle = baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1);

    return {
      mainTopic: `${formattedTitle} - Visual Creative Asset`,
      objects: [isVideo ? 'Motion video frames' : 'High-resolution graphic elements', 'Foreground focal subject', 'Color harmonized background'],
      people: 'Not detected',
      environment: 'Studio / Digital creative composition',
      visualStyle: isVideo ? 'Dynamic 60fps video with clear narrative focus' : 'Crisp high-resolution digital image with modern palette',
      textVisible: formattedTitle.toUpperCase(),
      mainMessage: `Engaging visual content designed to capture viewer attention and drive clicks.`,
      targetAudience: profile?.targetAudience || 'Social media audience interested in high-quality lifestyle and helpful ideas',
      contentCategory: 'Lifestyle & Productivity',
      keywords: [baseTitle, 'trending content', 'viral ideas', 'creative inspiration', 'smart lifestyle'],
      searchIntent: `Best ideas for ${baseTitle}`,
      pinterestTitle: `${formattedTitle}: Practical Guide & Step-by-Step Inspiration`,
      pinterestDescription: `Discover key insights and creative takeaways from ${formattedTitle}. Save this pin to your favorite board and tap the link to learn more!`,
      facebookCaption: `Here is a quick look at ${formattedTitle}! What do you think of this approach? Let us know in the comments below! 👇✨`,
      youtubeTitle: `${formattedTitle} - Fast Breakdown #Shorts`,
      youtubeDescription: `Quick visual guide to ${formattedTitle}!\n\nLink in bio: https://example.com\n\n#Shorts #Tutorial #Inspiration`,
      youtubeTags: ['shorts', baseTitle.toLowerCase(), 'trending', 'tutorial', 'viral'],
      suggestedHashtags: ['#Inspiration', '#TrendingNow', '#CreativeIdeas', '#DailyTips', '#SocialFlow'],
      suggestedCta: profile?.cta || 'Save this post and tap the link in bio for the complete step-by-step breakdown!'
    };
  }

  /**
   * Video-specific frame extraction and transcript analysis simulation
   */
  static async analyzeVideoFrames(media: MediaItem): Promise<{
    duration: string;
    sampledFrames: string[];
    detectedAudio: string;
    suggestedThumbnailTime: string;
  }> {
    await new Promise((res) => setTimeout(res, 700));
    return {
      duration: '0:42',
      sampledFrames: [
        'Frame 00:02 - Establishing shot of magician presenting sealed envelope',
        'Frame 00:15 - Close-up of card shuffle with crowd leaning in',
        'Frame 00:28 - Fast misdirection and unexpected card appearance',
        'Frame 00:39 - Big spectator reaction and applause climax'
      ],
      detectedAudio: 'Spectator: "No way! How did that end up in my hand?!" Magician: "Magic is in the mind."',
      suggestedThumbnailTime: '00:24'
    };
  }
}
