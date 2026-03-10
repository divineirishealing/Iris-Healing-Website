"""Seed the database with all 21 sessions and testimonials from the original divineirishealing.com"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os, uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

SESSIONS_DATA = [
    {"title": "Akashic Record Reading & Healing", "description": "Akashic Record Reading is a sacred insight session that accesses the energetic archive of your soul's journey across lifetimes. The Akashic Records are understood as a vibrational field of information containing your karmic imprints, soul contracts, ancestral influences, and evolutionary lessons shaping your present reality.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606496_19c12e333a98b4e53349.png"},
    {"title": "Ancestral Healing", "description": "Ancestral Healing is the sacred process of identifying and transforming inherited emotional, spiritual, and behavioral patterns passed through family lineages. It gently addresses intergenerational imprints such as fear, scarcity, addiction, rejection, or unprocessed grief that continue to influence present life experiences.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606520_82924554f7196cd01772.png"},
    {"title": "Bid Adieu", "description": "A sacred farewell ritual to lovingly release a soul who has transitioned. This session supports emotional closure, unresolved conversations, guilt, or unfinished feelings. Helping the departed soul to complete the karmic cycle. It creates a space for gratitude, peace, and dignified goodbye \u2014 allowing both the departed soul and your heart to move forward gently.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606532_00a9867e18a0e1e91dd1.png"},
    {"title": "Chakra Healing", "description": "Chakra Healing is a deep energetic alignment process that restores balance across the body's seven primary energy centers. When chakras are blocked or overactive, they can manifest as emotional instability, physical discomfort, or recurring life challenges. This session gently clears stagnation, regulates excess energy, and strengthens weakened centers.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606545_efee7f83168610c64a77.png"},
    {"title": "Circuit Healing", "description": "Circuit Healing is a deep energetic cleansing process designed to address underlying imbalances contributing to health concerns. It works by identifying and clearing disrupted energy pathways within the body's internal circuitry. Stress, trauma, suppressed emotions, and chronic overload can create energetic short circuits that affect physical and mental well-being.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606589_3095480727cbcfb1c684.png"},
    {"title": "Cord Cutting", "description": "Cord Cutting is a focused energetic release process that clears unhealthy attachments formed through intense emotional bonds, trauma, dependency, or prolonged stress. Energetic cords can develop in relationships \u2014 romantic, familial, professional \u2014 or even with past situations that still hold emotional charge.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606603_b4367bb40badd9789249.png"},
    {"title": "DNA Blueprint Reset", "description": "DNA Blueprint Reset is a deep energetic recalibration designed to shift subconscious and inherited patterns that silently influence health, relationships, success, and emotional stability. Many limitations are not just psychological \u2014 they are encoded through repeated family conditioning, survival responses, and long-standing belief systems.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606617_ec15afa3a733b9f7feae.png"},
    {"title": "Emotional Ease", "description": "Emotional Ease is a restorative clearing process designed to gently dissolve accumulated emotional pressure, suppressed feelings, and chronic inner heaviness. Over time, unprocessed grief, resentment, guilt, fear, or disappointment can settle into the nervous system, creating overwhelm, irritability, fatigue, or emotional numbness.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606660_b8df54d2971af489fb9c.png"},
    {"title": "Energy Density Reading", "description": "Energy Density Reading is a psychic and meditative scan that identifies dark, heavy, stagnant, intrusive, or disruptive energetic imprints affecting individuals or physical spaces. Emotional trauma, prolonged stress, conflict, psychic projections, environmental residue, or past events can accumulate and create dense energetic fields.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606673_de4e92d83eab6a7ad700.png"},
    {"title": "Inner Child Healing", "description": "Inner Child Healing is a deep restorative process that addresses unresolved emotional wounds formed during early life experiences. Childhood memories of rejection, neglect, criticism, fear, or unmet emotional needs often shape adult behaviors, attachment patterns, self-worth, and decision-making without conscious awareness.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606690_b6b1e91e6aa21eae867f.png"},
    {"title": "Karmic Grief Release", "description": "Karmic Grief Release is a deep clearing process designed to dissolve sorrow that feels older than this lifetime. Some grief does not stem from present events alone \u2014 it carries the weight of unresolved soul ties, unfinished emotional exchanges, ancestral pain, or karmic imprints that continue to echo through current relationships.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606720_921e5c530eb9a8e2b0c4.png"},
    {"title": "Mental Clarity", "description": "Mental Clarity is a focused reset for an overactive, overloaded, or fogged mental state. Constant thinking, worry loops, decision fatigue, and emotional overwhelm can cloud perception and weaken confidence. When the mind is overstimulated, it becomes reactive rather than responsive.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606732_3626660ced08dd407ea9.png"},
    {"title": "Nervous System Healing", "description": "Nervous System Healing is a stabilizing process designed to shift the body out of chronic stress and survival mode. Prolonged pressure, emotional trauma, or constant mental stimulation can keep the nervous system locked in fight, flight, freeze, or hyper-alert states.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606743_11f2866c64397de6131f.png"},
    {"title": "Past Life Reading", "description": "Past Life Reading is a guided insight session that explores previous incarnational imprints influencing your present experiences. Certain fears, attractions, talents, relationship patterns, or emotional triggers may not fully originate in this lifetime \u2014 they can carry echoes from unresolved past-life experiences.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606762_926c46de8fc2d2c73e23.png"},
    {"title": "Quantum Metabolic Detox", "description": "Quantum Metabolic Detox is a deep energetic reset designed to address the stress patterns, emotional imprints, and subconscious programs that influence metabolism and physical weight retention. Often, the body holds on not just to calories \u2014 but to unresolved survival responses, trauma memory, fear-based chemistry, and energetic congestion.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606777_ba37c722b4a20af0b3e7.png"},
    {"title": "Quantum Resonance Activation", "description": "Quantum Resonance Activation is an advanced energetic alignment process that elevates your internal frequency to match the reality you are ready to step into. Often, growth feels blocked not because of lack of effort \u2014 but because your inner resonance is still tuned to past limitations.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606790_b990f0afab2443704a9f.png"},
    {"title": "Soul Retrieval", "description": "Soul Retrieval is a deep restorative process that focuses on reclaiming fragmented parts of your energy that may have split away during trauma, shock, betrayal, prolonged stress, or emotional overwhelm.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606807_ea31cc301e3edbe1f7f3.png"},
    {"title": "Tarot Reading", "description": "Tarot Reading is an intuitive guidance session that offers clarity during uncertainty, transition, or important life decisions. The cards act as a reflective tool \u2014 bringing subconscious patterns, hidden influences, emotional blocks, and potential outcomes into conscious awareness.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606823_d07192efcbc2e7f9bbf6.png"},
    {"title": "The Shame-Shield-Body Connection", "description": "The Shame\u2013Shield\u2013Body Connection explores how unprocessed shame silently shapes posture, body tension, weight retention, voice suppression, and emotional withdrawal. When shame is internalized \u2014 from childhood criticism, rejection, failure, or comparison \u2014 the body often builds protective shields to avoid further hurt.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606839_e4e0822ec7c1a81baa8f.png"},
    {"title": "Trauma Clearing", "description": "Trauma Clearing is a focused healing process designed to release the emotional and physiological imprints left behind by distressing or overwhelming experiences. Trauma is not only what happened \u2014 it is what the body and nervous system continue to hold long after the event has passed.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606866_01c644db8ca5baa24df1.png"},
    {"title": "Weight Release (Energetic Ozempic)", "description": "Weight Release (Energetic Ozempic) is a focused energetic recalibration designed to address the subconscious and stress-driven factors that influence appetite, cravings, emotional eating, and metabolic resistance.", "image": "https://divineirishealing.com/assets/images/personal_sessions/1772606851_9bd7396cc3c6ea898df4.png"},
]

GRAPHIC_TESTIMONIALS = [
    {"name": "", "text": "Weight loss testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1770288231_121a7ff8d43c21a47ee2.jpeg"},
    {"name": "", "text": "Healing transformation", "image": "https://divineirishealing.com/assets/images/testimonials/1770288262_5df1ff82fddb95f146db.jpeg"},
    {"name": "", "text": "Life changing experience", "image": "https://divineirishealing.com/assets/images/testimonials/1770288598_757da7a271614cb10822.jpeg"},
    {"name": "", "text": "Emotional healing journey", "image": "https://divineirishealing.com/assets/images/testimonials/1770289072_ab4f5c6689469efb1b7f.jpeg"},
    {"name": "", "text": "Recovery and wellness", "image": "https://divineirishealing.com/assets/images/testimonials/1770289093_21c29f8d6a2dc5b1c8a9.jpeg"},
    {"name": "", "text": "Spiritual growth", "image": "https://divineirishealing.com/assets/images/testimonials/1770289131_cf06997582aa897db7fc.jpeg"},
    {"name": "", "text": "Energy healing results", "image": "https://divineirishealing.com/assets/images/testimonials/1770289153_a072f5d42a5e02165c0d.jpeg"},
    {"name": "", "text": "Personal transformation story", "image": "https://divineirishealing.com/assets/images/testimonials/1770289174_ac0c9bfc32bdb9d84fe4.jpeg"},
    {"name": "", "text": "Body healing testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1770289192_8c6bc2f9b2dbd96e74ee.jpeg"},
    {"name": "", "text": "Mind body connection", "image": "https://divineirishealing.com/assets/images/testimonials/1770289210_ef2a4f93ca54c382c728.jpeg"},
    {"name": "", "text": "Holistic wellness journey", "image": "https://divineirishealing.com/assets/images/testimonials/1770289233_e3aba475fa78bcff3752.jpeg"},
    {"name": "", "text": "Chakra balancing experience", "image": "https://divineirishealing.com/assets/images/testimonials/1770289258_972d592ed0dff3e89a5a.jpeg"},
    {"name": "", "text": "Ancestral healing results", "image": "https://divineirishealing.com/assets/images/testimonials/1770289281_4a39ab61be8e4c6ebf18.jpeg"},
    {"name": "", "text": "Soul healing experience", "image": "https://divineirishealing.com/assets/images/testimonials/1770289418_aa10db6d9677c85dc8fb.jpeg"},
    {"name": "", "text": "Trauma recovery testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1770289438_c49463798e7912dd6e27.jpeg"},
    {"name": "", "text": "Weight release and healing", "image": "https://divineirishealing.com/assets/images/testimonials/1770289472_43d8c1c0643b30020f1c.jpeg"},
    {"name": "Geet Sharma", "text": "Geet Sharma testimonial about healing experience", "image": "https://divineirishealing.com/assets/images/testimonials/1771406783_77c4cb3d51018f66cff5.png"},
    {"name": "Preeti Rana", "text": "Preeti Rana testimonial about transformation", "image": "https://divineirishealing.com/assets/images/testimonials/1771406888_f8b37016b522d4450f27.png"},
    {"name": "Uday Bhanu Chaturvedi", "text": "Uday Bhanu Chaturvedi testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771406917_39f6286cdc703cdb44b1.png"},
    {"name": "Amit", "text": "Amit healing testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407030_074208cdb860ec07bcd0.png"},
    {"name": "Ankita", "text": "Ankita transformation testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407096_e288442d79f8ba3078e2.png"},
    {"name": "Joseph", "text": "Joseph healing experience testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407127_934cf075f73a9a06cca1.png"},
    {"name": "Neha", "text": "Neha personal healing testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407192_2191bb436611415332f0.png"},
    {"name": "Rakesh Kumar", "text": "Rakesh Kumar healing journey testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407239_d3ea8d010f7f5ad2d89e.png"},
    {"name": "Ranjini", "text": "Ranjini testimonial healing transformation", "image": "https://divineirishealing.com/assets/images/testimonials/1771407260_327d3b3080939fe313a3.png"},
    {"name": "Tilak", "text": "Tilak testimonial healing", "image": "https://divineirishealing.com/assets/images/testimonials/1771407310_2e9a090cd0e91bbcca79.png"},
    {"name": "Ranjini MMM", "text": "Ranjini MMM Money Magic Multiplier testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407424_61ffcf5741d92c6c5d32.png"},
    {"name": "Kumkum", "text": "Kumkum healing testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407481_94eea73a2ffff056f5eb.png"},
    {"name": "Ranjini", "text": "Ranjini second testimonial healing journey", "image": "https://divineirishealing.com/assets/images/testimonials/1771407511_0c56ba7b923b33c5e0e1.png"},
    {"name": "Ravi", "text": "Ravi healing experience testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407536_6a9a744ef457e608d659.png"},
    {"name": "Shailesh", "text": "Shailesh testimonial healing journey", "image": "https://divineirishealing.com/assets/images/testimonials/1771407595_f5f3d8cdfea04fda3b09.png"},
    {"name": "Surabhi", "text": "Surabhi transformation testimonial", "image": "https://divineirishealing.com/assets/images/testimonials/1771407648_749f2e927e8c9705f133.png"},
]

VIDEO_TESTIMONIALS = [
    {"name": "Testimonial 1", "videoId": "FVgxpMEMnoc"},
    {"name": "Testimonial 2", "videoId": "UIO3eyGOt6o"},
    {"name": "Testimonial 3", "videoId": "-LfATPNpWzY"},
    {"name": "Testimonial 4", "videoId": "2Wxo8coV9z8"},
    {"name": "Testimonial 5", "videoId": "H72y4qBpr9w"},
    {"name": "Testimonial 6", "videoId": "Aok_iHSLzM4"},
    {"name": "Testimonial 7", "videoId": "QAyIlmdeoFQ"},
    {"name": "Testimonial 8", "videoId": "Sq5o9fwqqWk"},
    {"name": "Testimonial 9", "videoId": "i3UJ6t6xYwQ"},
    {"name": "Testimonial 10", "videoId": "GF5pkxAVfNc"},
    {"name": "Testimonial 11", "videoId": "gBKFr8pnSKM"},
    {"name": "Testimonial 12", "videoId": "yECblik4mHc"},
]

async def seed():
    # Seed sessions (replace old ones)
    existing_sessions = await db.sessions.count_documents({})
    if existing_sessions < 21:
        await db.sessions.delete_many({})
        for i, s in enumerate(SESSIONS_DATA):
            doc = {
                "id": str(uuid.uuid4()),
                "title": s["title"],
                "description": s["description"],
                "image": s["image"],
                "price_usd": 0.0,
                "price_inr": 0.0,
                "price_eur": 0.0,
                "price_gbp": 0.0,
                "duration": "60-90 minutes",
                "visible": True,
                "order": i,
                "created_at": datetime.now(timezone.utc)
            }
            await db.sessions.insert_one(doc)
        print(f"Seeded {len(SESSIONS_DATA)} sessions")
    else:
        print(f"Sessions already seeded ({existing_sessions} found)")

    # Seed testimonials
    existing_testimonials = await db.testimonials.count_documents({})
    if existing_testimonials < 30:
        await db.testimonials.delete_many({})
        order = 0
        for g in GRAPHIC_TESTIMONIALS:
            doc = {
                "id": str(uuid.uuid4()),
                "type": "graphic",
                "name": g["name"],
                "text": g["text"],
                "image": g["image"],
                "videoId": "",
                "thumbnail": "",
                "program_id": "",
                "visible": True,
                "order": order,
                "created_at": datetime.now(timezone.utc)
            }
            await db.testimonials.insert_one(doc)
            order += 1
        for v in VIDEO_TESTIMONIALS:
            doc = {
                "id": str(uuid.uuid4()),
                "type": "video",
                "name": v["name"],
                "text": f"{v['name']} video testimonial",
                "image": "",
                "videoId": v["videoId"],
                "thumbnail": f"https://img.youtube.com/vi/{v['videoId']}/maxresdefault.jpg",
                "program_id": "",
                "visible": True,
                "order": order,
                "created_at": datetime.now(timezone.utc)
            }
            await db.testimonials.insert_one(doc)
            order += 1
        print(f"Seeded {order} testimonials ({len(GRAPHIC_TESTIMONIALS)} graphic + {len(VIDEO_TESTIMONIALS)} video)")
    else:
        print(f"Testimonials already seeded ({existing_testimonials} found)")

    # Ensure programs have order/visible fields
    programs = await db.programs.find().to_list(100)
    for i, p in enumerate(programs):
        update = {}
        if "visible" not in p:
            update["visible"] = True
        if "order" not in p:
            update["order"] = i
        if update:
            await db.programs.update_one({"_id": p["_id"]}, {"$set": update})
    print(f"Updated {len(programs)} programs with order/visible fields")

    # Ensure site settings exist
    settings = await db.site_settings.find_one({"id": "site_settings"})
    if not settings:
        await db.site_settings.insert_one({
            "id": "site_settings",
            "heading_font": "Playfair Display",
            "body_font": "Lato",
            "heading_color": "#1a1a1a",
            "body_color": "#4a4a4a",
            "accent_color": "#D4AF37",
            "heading_size": "default",
            "body_size": "default"
        })
        print("Seeded site settings")

    print("Seed complete!")

asyncio.run(seed())
